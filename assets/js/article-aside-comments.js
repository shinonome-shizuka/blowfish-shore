// 文章页右栏 · 评论（utterances）· 注入到 .aside-card__comments-mount
// 必须在 DOMContentLoaded 之后跑，依赖 repo 属性
(function () {
  "use strict";
  var mount = document.querySelector(".aside-card__comments-mount");
  if (!mount) return;
  var repo = mount.getAttribute("data-repo");
  if (!repo) return;

  // 当前主题 · 与 <html> class 同步
  var isDark = document.documentElement.classList.contains("dark");
  var theme = isDark ? "github-dark" : "github-light";

  var script = document.createElement("script");
  script.src = "https://utteranc.es/client.js";
  script.setAttribute("repo", repo);
  script.setAttribute("issue-term", "pathname");
  script.setAttribute("label", "comments");
  script.setAttribute("theme", theme);
  script.setAttribute("crossorigin", "anonymous");
  script.async = true;
  mount.appendChild(script);
})();