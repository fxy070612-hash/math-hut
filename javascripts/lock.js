// ===== 网站密码锁 =====
// ⚠ 这是"轻量级"保护：密码存在前端代码里，防不住高手，但能拦住随便路过的人。
// 想改密码：把下面 SITE_PASSWORD 的值改成你自己的，比如 "mysecret"。

const SITE_PASSWORD = "123210Fang";
const UNLOCK_KEY = "math_hut_unlocked";

function mathHutShowLock() {
  if (!MathHutLocked()) return;
  let lock = document.getElementById("site-lock");
  if (lock) { lock.style.display = "flex"; return; }

  lock = document.createElement("div");
  lock.id = "site-lock";
  lock.innerHTML =
    '<div class="lock-box">' +
      '<div class="lock-icon">🔐</div>' +
      '<div class="lock-title">embar 的数学小屋</div>' +
      '<div class="lock-sub">请输入密码</div>' +
      '<input id="lock-pass" type="password" placeholder="密码" autocomplete="off">' +
      '<button id="lock-btn">进入</button>' +
      '<div id="lock-err"></div>' +
    '</div>';
  document.body.appendChild(lock);

  const inp = document.getElementById("lock-pass");
  const err = document.getElementById("lock-err");
  function tryUnlock() {
    if (inp.value === SITE_PASSWORD) {
      try { sessionStorage.setItem(UNLOCK_KEY, "yes"); } catch (e) {}
      lock.style.display = "none";
    } else {
      err.textContent = "密码不对，再试试";
      inp.value = "";
      inp.focus();
    }
  }
  document.getElementById("lock-btn").addEventListener("click", tryUnlock);
  inp.addEventListener("keydown", function (e) { if (e.key === "Enter") tryUnlock(); });
  setTimeout(function () { inp.focus(); }, 60);
}

function MathHutLocked() {
  try { return sessionStorage.getItem(UNLOCK_KEY) !== "yes"; }
  catch (e) { return true; }
}

(function () {
  if (typeof document$ !== "undefined") {
    document$.subscribe(mathHutShowLock);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mathHutShowLock);
  } else {
    mathHutShowLock();
  }
})();
