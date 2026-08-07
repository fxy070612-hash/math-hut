/* =========================================================
   AI Agent 运行流程 · 互动演示
   只在自己的页面（#agentDemo 存在时）初始化。
   用 document$ 事件，兼容 Material instant 导航。
   ========================================================= */
document$.subscribe(function () {
  var demo = document.getElementById("agentDemo");
  if (!demo) return;

  var ROLE = {
    brain: "大脑 · LLM",
    eye: "眼睛 · 上下文",
    hand: "手脚 · 工具",
  };

  var STEPS = [
    { n: "1", name: "用户请求", desc: "「帮我查北京明天的天气」", role: "eye",
      log: "这句话进入「上下文」——Agent 的眼睛里现在有它了。" },
    { n: "2", name: "LLM 思考", desc: "查天气要实时数据，我的知识不够新", role: "brain",
      log: "「大脑」分析了请求：天气是实时信息，得靠工具，不能瞎编。" },
    { n: "3", name: "选择工具", desc: "从工具清单里挑出 get_weather", role: "brain",
      log: "「大脑」翻看工具清单，决定调用 get_weather（城市=北京）。" },
    { n: "4", name: "执行工具", desc: "get_weather 联网查询，返回数据", role: "hand",
      log: "「手脚」动起来了：工具联网查回 {temp:28, sky:晴}。" },
    { n: "5", name: "结果回填", desc: "查询结果追加回上下文", role: "eye",
      log: "结果被放回「上下文」，大脑现在能看到新信息了。" },
    { n: "6", name: "回复用户", desc: "「北京明天 28°C，晴」", role: "brain",
      log: "「大脑」根据看到的结果组织语言，把答案说给你听。整个循环又可以再来一次。" },
  ];

  var idx = -1;
  var timer = null;
  var finished = false;

  demo.innerHTML =
    '<h3>🎮 亲手体验：Agent 是怎么工作的</h3>' +
    '<p class="demo-sub">点「下一步」，看一个查天气请求从进来到最后回答的完整过程。' +
    '<span style="color:#6db1ff">蓝</span>=大脑(LLM)，<span style="color:#c8a6ff">紫</span>=眼睛(上下文)，<span style="color:#5ad1a8">绿</span>=手脚(工具)。</p>' +
    '<div class="demo-legend">' +
      '<span><i class="dot brain"></i>大脑 · LLM</span>' +
      '<span><i class="dot eye"></i>眼睛 · 上下文</span>' +
      '<span><i class="dot hand"></i>手脚 · 工具</span>' +
    "</div>" +
    '<div class="demo-flow" id="demoFlow"></div>' +
    '<div class="demo-log" id="demoLog"></div>' +
    '<div class="demo-controls">' +
      '<button id="demoStep">开始演示 ▶</button>' +
      '<button id="demoPlay" class="secondary">自动播放 ▶▶</button>' +
      '<button id="demoReset" class="secondary">重置 ↺</button>' +
    "</div>";

  var $flow = demo.querySelector("#demoFlow");
  var $log = demo.querySelector("#demoLog");
  var $step = demo.querySelector("#demoStep");
  var $play = demo.querySelector("#demoPlay");
  var $reset = demo.querySelector("#demoReset");

  // 渲染节点流
  STEPS.forEach(function (s) {
    var d = document.createElement("div");
    d.className = "demo-node";
    d.id = "node-" + s.n;
    d.innerHTML =
      '<span class="step-num">' + s.n + "</span>" +
      '<span class="node-name">' + s.name + '<span class="node-desc"> · ' + s.desc + "</span></span>" +
      '<span class="role-tag role-' + s.role + '">' + ROLE[s.role] + "</span>";
    $flow.appendChild(d);
  });

  function addLog(html) {
    var line = document.createElement("div");
    line.className = "log-line new";
    line.innerHTML = html;
    $log.appendChild(line);
    $log.scrollTop = $log.scrollHeight;
  }

  function step() {
    if (finished) return;
    if (idx >= 0) {
      document.getElementById("node-" + STEPS[idx].n).classList.remove("active");
      document.getElementById("node-" + STEPS[idx].n).classList.add("done");
    }
    idx++;
    if (idx >= STEPS.length) { finish(); return; }
    var s = STEPS[idx];
    document.getElementById("node-" + s.n).classList.add("active");
    addLog("<b>" + s.n + ". " + s.name + "</b> — " + s.log);
    // 最后一步走完，紧跟着给出总结
    if (idx === STEPS.length - 1) { finish(); }
    else { $step.textContent = "下一步 ▶"; }
  }

  function finish() {
    if (finished) return;
    finished = true;
    if (timer) { clearInterval(timer); timer = null; }
    // 当前节点收尾：从高亮态转为完成态
    var cur = document.getElementById("node-" + STEPS[STEPS.length - 1].n);
    if (cur) { cur.classList.remove("active"); cur.classList.add("done"); }
    addLog("🎉 <b>完成！</b>你刚才看到的，就是 AI Agent 最核心的 <b>ReAct 循环</b>：<b>思考 → 行动 → 观察 → 再思考</b>，一直循环到任务完成。");
    $step.disabled = true;
    $play.textContent = "再播一遍 🔁";
  }

  function reset() {
    if (timer) { clearInterval(timer); timer = null; }
    idx = -1;
    finished = false;
    STEPS.forEach(function (s) {
      var n = document.getElementById("node-" + s.n);
      n.classList.remove("active", "done");
    });
    $log.innerHTML = '<span class="log-line">准备好了，点「开始演示」~</span>';
    $step.textContent = "开始演示 ▶";
    $step.disabled = false;
    $play.textContent = "自动播放 ▶▶";
    $play.disabled = false;
  }

  function play() {
    if (timer) {
      clearInterval(timer); timer = null;
      $play.textContent = "自动播放 ▶▶";
      return;
    }
    if (finished) reset();
    $play.textContent = "暂停 ⏸";
    timer = setInterval(function () {
      if (finished) {
        clearInterval(timer); timer = null;
        $play.textContent = "自动播放 ▶▶";
        return;
      }
      step();
    }, 1600);
  }

  $step.addEventListener("click", step);
  $play.addEventListener("click", play);
  $reset.addEventListener("click", reset);
});
