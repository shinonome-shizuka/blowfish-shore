// 文章页右栏 · 关联 links · 从 .article-content 提取 <a> 注入 #article-aside-links-list
// 过滤：内部 #、mailto:、javascript:、同站链接（refer 段已展示原文链接）
// 三按钮：分享 (navigator.share / 复制 URL) · 打印 (window.print) · RSS 已是链接
(function () {
  "use strict";
  var list = document.getElementById("article-aside-links-list");
  var content = document.querySelector(".article-content");

  // 按钮交互
  var actions = document.querySelectorAll(".aside-action[data-action]");
  actions.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var act = btn.getAttribute("data-action");
      if (act === "print") {
        window.print();
        return;
      }
      if (act === "share") {
        var url = location.href;
        var title = document.title;
        if (navigator.share) {
          navigator.share({ title: title, url: url }).catch(function () {});
        } else if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(function () {
            var labelEl = btn.querySelector(".aside-action__label");
            if (labelEl) {
              var old = labelEl.textContent;
              labelEl.textContent = "已复制";
              setTimeout(function () { labelEl.textContent = old; }, 1400);
            }
          }).catch(function () {});
        }
      }
    });
  });

  if (!list || !content) return;

  var origin = location.origin;
  var seen = {};
  var links = content.querySelectorAll("a[href]");
  var frag = document.createDocumentFragment();

  links.forEach(function (a) {
    var href = a.getAttribute("href");
    if (!href) return;
    if (href.charAt(0) === "#") return;
    if (/^(mailto|javascript|tel):/i.test(href)) return;
    if (href.indexOf(origin) === 0) return;
    if (a.classList.contains("email-link")) return;
    if (seen[href]) return;
    seen[href] = true;

    var li = document.createElement("li");
    var host = "";
    try { host = new URL(href, location.href).hostname.replace(/^www\./, ""); } catch (e) {}
    var label = (a.textContent || "").trim() || host || href;
    if (label.length > 32) label = label.slice(0, 30) + "…";

    var anchor = document.createElement("a");
    anchor.href = href;
    anchor.rel = "noopener noreferrer";
    anchor.target = "_blank";
    anchor.className = "aside-link";
    anchor.textContent = label;
    if (host) {
      var span = document.createElement("span");
      span.className = "aside-link__host";
      span.textContent = host;
      anchor.appendChild(span);
    }
    li.appendChild(anchor);
    frag.appendChild(li);
  });

  if (frag.childNodes.length === 0) {
    list.innerHTML = '<li class="aside-card__empty">无外链</li>';
  } else {
    list.appendChild(frag);
  }
})();