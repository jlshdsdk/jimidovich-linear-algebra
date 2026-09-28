/* ============================================================
   吉米多维奇线性代数 · 刷题版 — 公共交互逻辑
   无框架，原生实现。依赖（仅章节页）：本地 KaTeX
   ============================================================ */
(function () {
  'use strict';

  var THEME_KEY = 'jmla-theme';
  var DONE_KEY = 'jmla-done';

  /* ---------- 工具 ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function getDone() {
    try { return JSON.parse(localStorage.getItem(DONE_KEY) || '{}'); } catch (e) { return {}; }
  }
  function setDone(map) { localStorage.setItem(DONE_KEY, JSON.stringify(map)); }

  /* ---------- 夜间模式 ---------- */
  var themeBtn = $('#themeToggle');
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    if (themeBtn) themeBtn.textContent = t === 'dark' ? '☀️ 日间' : '🌙 夜间';
  }
  var savedTheme = null;
  try { savedTheme = localStorage.getItem(THEME_KEY); } catch (e) {}
  applyTheme(savedTheme === 'dark' ? 'dark' : 'light');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      var next = cur === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    });
  }

  /* ---------- 返回顶部 ---------- */
  var backTop = $('#backTop');
  if (backTop) {
    window.addEventListener('scroll', function () {
      backTop.classList.toggle('show', window.scrollY > 600);
    }, { passive: true });
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============================================================
     首页逻辑
     ============================================================ */
  var isHome = document.body.classList.contains('page-home');
  if (isHome) {
    // 章节手风琴
    $all('.toc-chapter-head').forEach(function (head) {
      head.addEventListener('click', function () {
        head.parentElement.classList.toggle('open');
      });
    });

    // 进度统计：done map 的键形如 "章.题"
    var done = getDone();
    var totalAll = 0, doneAll = 0;
    $all('.toc-chapter').forEach(function (ch) {
      var c = ch.getAttribute('data-chapter');
      var total = parseInt(ch.getAttribute('data-total'), 10) || 0;
      var d = 0;
      for (var k in done) {
        if (Object.prototype.hasOwnProperty.call(done, k) && k.indexOf(c + '.') === 0) d++;
      }
      totalAll += total; doneAll += d;
      var meta = $('.ch-meta', ch);
      if (meta) meta.textContent = '共 ' + total + ' 题 · 已做 ' + d + ' 题';
      if (d >= total && total > 0) ch.classList.add('open');
    });
    var pct = totalAll ? Math.round(doneAll / totalAll * 100) : 0;
    var bar = $('#overallBar');
    if (bar) bar.style.width = pct + '%';
    var pctText = $('#overallPct');
    if (pctText) pctText.textContent = '总进度 ' + doneAll + '/' + totalAll + '（' + pct + '%）';
  }

  /* ============================================================
     章节页逻辑
     ============================================================ */
  var isChapter = document.body.classList.contains('page-chapter');
  if (isChapter) {

    /* ----- 移动端侧栏 ----- */
    var sidebar = $('#sidebar');
    var sideBtn = $('#sidebarToggle');
    var mask = $('#sideMask');
    function closeSidebar() {
      sidebar.classList.remove('open');
      mask.classList.remove('show');
    }
    if (sideBtn && sidebar) {
      sideBtn.addEventListener('click', function () {
        sidebar.classList.toggle('open');
        mask.classList.toggle('show', sidebar.classList.contains('open'));
      });
    }
    if (mask) mask.addEventListener('click', closeSidebar);
    $all('.prob-grid a, .sec-link', sidebar || document).forEach(function (a) {
      a.addEventListener('click', closeSidebar);
    });

    /* ----- KaTeX 懒渲染：进入视口前 600px 才渲染该卡片 ----- */
    function renderCard(el) {
      if (el.getAttribute('data-katex')) return;
      el.setAttribute('data-katex', '1');
      if (typeof renderMathInElement === 'function') {
        renderMathInElement(el, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false }
          ],
          throwOnError: false
        });
      }
    }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { renderCard(en.target); io.unobserve(en.target); }
        });
      }, { rootMargin: '600px 0px' });
      $all('.problem, .note-block, .type-block').forEach(function (el) { io.observe(el); });
    } else {
      $all('.problem, .note-block, .type-block').forEach(renderCard);
    }

    /* ----- 解析折叠/展开 ----- */
    $all('.problem').forEach(function (prob) {
      var btn = $('.btn-sol', prob);
      var sol = $('.prob-sol', prob);
      if (!btn || !sol) return;
      btn.addEventListener('click', function () {
        var col = sol.classList.toggle('collapsed');
        btn.textContent = col ? '展开解析' : '收起解析';
      });
    });

    /* ----- 已做标记 ----- */
    var chapterNo = document.body.getAttribute('data-chapter');
    function refreshDoneUI() {
      var done = getDone();
      var probs = $all('.problem');
      var d = 0;
      probs.forEach(function (prob) {
        var pid = prob.getAttribute('data-pid');
        var on = !!done[pid];
        var btn = $('.btn-done', prob);
        if (btn) btn.classList.toggle('on', on);
        prob.classList.toggle('is-done', on);
        if (on) d++;
        var gridLink = $('.prob-grid a[data-pid="' + pid + '"]');
        if (gridLink) gridLink.classList.toggle('done', on);
      });
      var stat = $('#chapterStat');
      if (stat) stat.textContent = '已做 ' + d + ' / ' + probs.length + ' 题';
    }
    $all('.problem').forEach(function (prob) {
      var btn = $('.btn-done', prob);
      if (!btn) return;
      btn.addEventListener('click', function () {
        var pid = prob.getAttribute('data-pid');
        var done = getDone();
        if (done[pid]) delete done[pid]; else done[pid] = 1;
        setDone(done);
        refreshDoneUI();
      });
    });
    refreshDoneUI();

    /* ----- 上一题 / 下一题 ----- */
    var problems = $all('.problem');
    function currentProblemIndex() {
      var best = 0, bestDist = Infinity;
      var ref = window.scrollY + 120;
      problems.forEach(function (p, i) {
        var dist = Math.abs(p.offsetTop - ref);
        if (p.offsetTop <= ref + 40) dist = Math.abs(ref - p.offsetTop) * 0.5;
        if (dist < bestDist) { bestDist = dist; best = i; }
      });
      return best;
    }
    function gotoProblem(i) {
      if (i < 0 || i >= problems.length) return;
      problems[i].scrollIntoView({ behavior: 'smooth', block: 'start' });
      problems[i].classList.add('flash');
      setTimeout(function () { problems[i].classList.remove('flash'); }, 900);
    }
    var prevBtn = $('#prevProb'), nextBtn = $('#nextProb');
    if (prevBtn) prevBtn.addEventListener('click', function () { gotoProblem(currentProblemIndex() - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { gotoProblem(currentProblemIndex() + 1); });
    document.addEventListener('keydown', function (e) {
      if (e.target && /^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;
      if (e.key === 'ArrowLeft') gotoProblem(currentProblemIndex() - 1);
      if (e.key === 'ArrowRight') gotoProblem(currentProblemIndex() + 1);
    });

    /* ----- 侧栏 scrollspy ----- */
    var secBlocks = $all('.sec-block');
    var secLinks = $all('.sec-link');
    if ('IntersectionObserver' in window && secBlocks.length) {
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          var id = en.target.id;
          secLinks.forEach(function (l) {
            l.classList.toggle('active', l.getAttribute('href') === '#' + id);
          });
        });
      }, { rootMargin: '-20% 0px -70% 0px' });
      secBlocks.forEach(function (b) { spy.observe(b); });
    }
  }
})();
