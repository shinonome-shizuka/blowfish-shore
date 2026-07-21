/* longbeach-shore · entrance grain
   ────────────────────────────────────────────────────────────
   Canvas-generated halftone texture for body background.
   Density / radius / opacity driven by 2D simplex-style noise,
   producing spatial gradients (Bayesian-feeling density map).

   Output: --grain-url CSS variable → consumed by body::before.
   Skip flag: <html data-no-grain> bypasses generation.
   Dark mode handled by reading matchMedia on init. */

(function () {
  "use strict";

  if (document.documentElement.hasAttribute("data-no-grain")) return;

  /* 2D value-noise + bilinear interp — cheap, no deps. */
  const N = 256;
  const perm = new Uint8Array(N * 2);
  for (let i = 0; i < N; i++) perm[i] = perm[i + N] = (Math.random() * 256) | 0;
  const grad2 = [
    [1, 1], [-1, 1], [1, -1], [-1, -1],
    [1, 0], [-1, 0], [0, 1], [0, -1],
  ];
  const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (a, b, t) => a + (b - a) * t;
  const noise2 = (x, y) => {
    const xi = Math.floor(x) & 255, yi = Math.floor(y) & 255;
    const xf = x - Math.floor(x), yf = y - Math.floor(y);
    const u = fade(xf), v = fade(yf);
    const aa = perm[perm[xi] + yi];
    const ab = perm[perm[xi] + yi + 1];
    const ba = perm[perm[xi + 1] + yi];
    const bb = perm[perm[xi + 1] + yi + 1];
    const dot = (g, x, y) => g[0] * x + g[1] * y;
    const x1 = lerp(dot(grad2[aa & 7], xf, yf), dot(grad2[ba & 7], xf - 1, yf), u);
    const x2 = lerp(dot(grad2[ab & 7], xf, yf - 1), dot(grad2[bb & 7], xf - 1, yf - 1), u);
    return lerp(x1, x2, v);
  };

  /* Fractal Brownian Motion — multiple octaves of noise. */
  const fbm = (x, y) => {
    let v = 0, a = 0.5, f = 1;
    for (let i = 0; i < 4; i++) {
      v += a * noise2(x * f, y * f);
      a *= 0.5;
      f *= 2;
    }
    return v;
  };

  const DARK = matchMedia("(prefers-color-scheme: dark)").matches;

  /* Bayesian-feeling density: large cells, each gets a noise-driven dot budget.
     Bigger cell → blockier texture (vintage screen-print), smaller cell → finer. */
  const CELL = 36;

  const render = (w, h) => {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");

    const cx = w / 2, cy = h / 2;
    const rMax = Math.max(w, h) * 0.6;
    ctx.fillStyle = "rgba(0,0,0,0.32)";

    /* Grid scan — every cell gets a density value from radial + fbm. */
    for (let gx = 0; gx < w; gx += CELL) {
      for (let gy = 0; gy < h; gy += CELL) {
        const mx = gx + CELL / 2;
        const my = gy + CELL / 2;
        const dx = mx - cx, dy = my - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        /* Bayesian-style: large radial trend (slow spatial) + fbm micro-variation. */
        const radial = 1 - Math.min(dist / rMax, 1);
        const radialW = 0.15 + Math.pow(radial, 1.4) * 0.85;
        const n = fbm(mx * 0.005, my * 0.005) * 0.5 + 0.5;
        const field = Math.max(0, Math.min(1, radialW * (0.4 + n * 0.85)));

        /* Map density to dot count 0..6 per cell. */
        const dots = Math.round(field * 6);
        for (let k = 0; k < dots; k++) {
          const u = gx + Math.random() * CELL;
          const v = gy + Math.random() * CELL;
          const r = 0.5 + field * 1.4 + Math.random() * 0.6;
          ctx.beginPath();
          ctx.arc(u, v, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    /* Old-paper press lines — kept thin, page colour unchanged. */
    ctx.globalAlpha = 0.14;
    ctx.fillStyle = "#000";
    for (let y = 0; y < h; y += 6) {
      if (Math.random() < 0.25) ctx.fillRect(0, y, w, 1);
    }
    ctx.globalAlpha = 1;

    return c.toDataURL("image/png");
  };

  const apply = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const url = render(w, h);
    document.documentElement.style.setProperty("--grain-url", `url("${url}")`);
    document.documentElement.style.setProperty("--grain-size", `${w}px ${h}px`);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply, { once: true });
  } else {
    apply();
  }

  /* Re-render on resize, debounced. */
  let resizeT;
  window.addEventListener("resize", () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(apply, 150);
  }, { passive: true });
})();