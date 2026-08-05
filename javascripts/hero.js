/* 主页 Hero 漂浮数学符号 */
(function () {
  var hero = document.querySelector('.math-hero');
  if (!hero) return;
  var symbols = ['π', '∑', '∫', '√', '∞', 'λ', 'Δ', 'φ', '∂', 'e', 'Σ', 'θ'];
  for (var i = 0; i < 14; i++) {
    var s = document.createElement('span');
    s.className = 'hero-symbol';
    s.textContent = symbols[i % symbols.length];
    s.style.left = (Math.random() * 88 + 6) + '%';
    s.style.top = (Math.random() * 55 + 25) + '%';
    s.style.fontSize = (Math.random() * 1.6 + 1.0) + 'rem';
    s.style.animationDuration = (Math.random() * 8 + 9) + 's';
    s.style.animationDelay = (Math.random() * 9) + 's';
    hero.appendChild(s);
  }
})();
