// 给所有内容页顶部注入一个"← 返回"按钮
document$.subscribe(function () {
  // 主页不加（含子路径 /xxx/ 的情况）
  var path = window.location.pathname;
  if (path === "/" || path.endsWith("/index.html") || path.endsWith("/")) return;
  if (document.getElementById("page-back")) return;

  var inner = document.querySelector(".md-content__inner");
  if (!inner) return;

  var a = document.createElement("a");
  a.id = "page-back";
  a.className = "page-back";
  a.textContent = "← 返回";
  a.href = "/";   // 兜底：没有历史记录时回到主页
  a.addEventListener("click", function (e) {
    if (window.history.length > 1) {
      e.preventDefault();
      window.history.back();
    }
  });
  inner.prepend(a);
});
