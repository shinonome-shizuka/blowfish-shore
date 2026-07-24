// verse-reveal.js · 一言 + ASCII noise 渐显
// ────────────────────────────────────────────────
// 1) 把所有 [data-hitokoto] 元素填充为从 hitokoto.cn 抓到的句子（带回退）
// 2) 把 .entrance-hero__verse-wrap 内的字符逐步由 ASCII noise 渐显为最终诗句（7 pass × 90ms）
// sessionStorage 去重最近一句。
// ────────────────────────────────────────────────
(function () {
  'use strict';

  const FALLBACK = '弃我去者，昨日之日不可留。';
  const STORAGE_KEY = '__lastVerse';
  const VERSE_POOL = [
    '无上清凉花满席。',
    '横剑夜听雨浸溪。',
    '庭下如积水空明。',
    '山色有无中。',
    '十笏茅斋寒。',
    '花落人独立。',
    '溪边照影行。',
    '云水自悠悠。',
    '松风吹解带。',
    '江上数峰青。',
    '清露晨流光。',
    '风定花犹落。'
  ];

  const NOISE_POOL =
    '·∴∵•◦◌▢△▲▼□◇○●' +
    '@#$%&*+=<>?/|\\:;,.~^[]{}()_-' +
    'ABCDEFGHIJKMNPQRSTUVWXYZ' +
    'abcdefghijkmnopqrstuvwxyz';

  function pickVerse() {
    const last = sessionStorage.getItem(STORAGE_KEY);
    let idx = Math.floor(Math.random() * VERSE_POOL.length);
    while (VERSE_POOL[idx] === last && VERSE_POOL.length > 1) {
      idx = Math.floor(Math.random() * VERSE_POOL.length);
    }
    sessionStorage.setItem(STORAGE_KEY, VERSE_POOL[idx]);
    return VERSE_POOL[idx];
  }

  function randLenStr(len) {
    let s = '';
    for (let k = 0; k < len; k++) {
      s += NOISE_POOL.charAt(Math.floor(Math.random() * NOISE_POOL.length));
    }
    return s;
  }

  function fillHitokoto() {
    const targets = document.querySelectorAll('[data-hitokoto]');
    if (!targets.length) return;
    fetch('https://v1.hitokoto.cn?encode=json&charset=utf-8', { method: 'GET', cache: 'no-store' })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(j => {
        const text = (j && (j.hitokoto || '')).trim();
        targets.forEach(el => {
          if (text) el.textContent = text + (j.from ? `（${j.from}）` : '');
        });
      })
      .catch(() => {
        targets.forEach(el => { el.textContent = FALLBACK; });
      });
  }

  function revealVerse() {
    const wrap = document.querySelector('.entrance-hero__verse-wrap');
    if (!wrap) return;
    const p = wrap.querySelector('.entrance-hero__verse');
    if (!p) return;
    const final = pickVerse();
    if (!final) return;
    const finalLen = final.length;
    const passes = 7;
    let i = 0;
    p.textContent = randLenStr(finalLen);
    const tick = setInterval(() => {
      i++;
      const stableCount = Math.floor((i / passes) * finalLen);
      let s = '';
      for (let j = 0; j < finalLen; j++) {
        s += j < stableCount
          ? final.charAt(j)
          : NOISE_POOL.charAt(Math.floor(Math.random() * NOISE_POOL.length));
      }
      p.textContent = s;
      if (i >= passes) {
        clearInterval(tick);
        p.textContent = final;
        p.classList.add('is-final');
      }
    }, 90);
    setTimeout(() => {
      clearInterval(tick);
      p.textContent = final;
      p.classList.add('is-final');
    }, 3000);
  }

  function init() {
    fillHitokoto();
    revealVerse();
  }

  function boot() {
    const fontReady = (document.fonts && document.fonts.ready) || Promise.resolve();
    fontReady.then(init);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
