// JellyClaw: theme toggle + quick-start tabs. Nothing else.

(function () {
  var toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var root = document.documentElement;
      var light = root.getAttribute('data-theme') === 'light';
      if (light) root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', 'light');
      try { localStorage.setItem('theme', light ? 'dark' : 'light'); } catch (e) { /* default dark */ }
    });
  }

  document.querySelectorAll('[data-tabs]').forEach(function (group) {
    var tabs = group.querySelectorAll('.tab');
    var panels = group.querySelectorAll('.tab-panel');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) {
          t.classList.toggle('active', t === tab);
          t.setAttribute('aria-selected', String(t === tab));
        });
        panels.forEach(function (p) {
          p.classList.toggle('active', p.id === tab.dataset.panel);
        });
      });
    });
  });
})();
