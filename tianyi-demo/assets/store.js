/* ============================================================
   TY  —  共用数据层 / 交互追踪 / 滚动揭示
   全部用 localStorage，无后端、无网络请求，file:// 可用
   ============================================================ */
(function (w) {
  var KEY = 'tianyige.events.v1';
  var MAX = 600;

  function now() { return Date.now(); }

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
    catch (e) { return []; }
  }

  function write(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list.slice(-MAX))); }
    catch (e) { /* 隐私模式忽略 */ }
  }

  function track(page, action, meta) {
    var list = read();
    list.push({ p: page, a: action, m: meta || null, t: now() });
    write(list);
    w.dispatchEvent(new CustomEvent('ty:track', { detail: { page: page, action: action } }));
  }

  function clear() { write([]); w.dispatchEvent(new CustomEvent('ty:clear')); }

  /* 汇总：总量 / 分页 / 分动作 / 时段 / 最近 */
  function summary() {
    var list = read();
    var byPage = {}, byAction = {}, byHour = {};
    list.forEach(function (e) {
      byPage[e.p] = (byPage[e.p] || 0) + 1;
      byAction[e.a] = (byAction[e.a] || 0) + 1;
      var h = new Date(e.t).getHours();
      byHour[h] = (byHour[h] || 0) + 1;
    });
    return { total: list.length, list: list, byPage: byPage, byAction: byAction, byHour: byHour };
  }

  /* 模拟一位游客的完整动线（用于看板演示） */
  function simulate() {
    var pages = ['序·牌墙', '定·纸变竹', '解·牌面密码', '传·寰宇航线', '续·我的牌面'];
    var acts = ['进入页面', '点击牌面', '切换牌面', '查看释义', '生成牌面'];
    var base = now() - 1000 * 60 * 4;
    var list = read();
    var n = 6 + Math.floor(Math.random() * 10);
    for (var i = 0; i < n; i++) {
      var p = pages[Math.floor(Math.random() * pages.length)];
      var a = acts[Math.floor(Math.random() * acts.length)];
      list.push({ p: p, a: a, m: { sim: true }, t: base + i * (18000 + Math.random() * 30000) });
    }
    write(list);
    w.dispatchEvent(new CustomEvent('ty:track', { detail: { page: '模拟', action: '游客动线' } }));
    return n;
  }

  /* 滚动揭示 */
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in w)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* 顶栏当前页高亮 */
  function initNav() {
    var here = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.topnav a').forEach(function (a) {
      var href = a.getAttribute('href') || '';
      if (href.split('#')[0] === here) a.classList.add('on');
    });
  }

  /* 顶部细进度条 */
  function initProgress() {
    var bar = document.createElement('div');
    bar.style.cssText = 'position:fixed;top:0;left:0;height:2px;width:0;z-index:99;background:linear-gradient(90deg,#A13A2C,#C4573F);transition:width .12s linear;pointer-events:none';
    document.body.appendChild(bar);
    function upd() {
      var h = document.documentElement.scrollHeight - innerHeight;
      bar.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + '%';
    }
    addEventListener('scroll', upd, { passive: true });
    upd();
  }

  function boot() {
    try { initNav(); initReveal(); initProgress(); } catch (e) { }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  w.TY = { track: track, read: read, clear: clear, summary: summary, simulate: simulate, KEY: KEY };
})(window);
