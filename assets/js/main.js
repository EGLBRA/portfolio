/* ============================================================
   Eric Leite · Portfólio · motor de interações
   Estratégia organizacional e design de soluções.
   Vanilla JS, sem dependências. Funciona via file:// ou http.
   Módulos: loader, dock do nome, cursor, nav, fit do hero,
   campo de fluxo (ponto de alavancagem), repertório, reveals,
   contadores, radar de futuros, overlay de estudos de caso.
   ============================================================ */
(function () {
  'use strict';

  /* O flag do sistema modera apenas movimento contínuo (parallax, varredura);
     animações curtas de entrada rodam sempre: são a identidade do site. */
  var reducedOS = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var touch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var easeOut = function (t) { return 1 - Math.pow(1 - t, 3); };

  /* ============================================================
     1 · LOADER
     ============================================================ */
  var loader = $('#loader');
  var loaderDone = false;

  function finishLoader() {
    if (loaderDone || !loader) return;
    loaderDone = true;
    dockName(function () {
      loader.classList.add('done');
      document.documentElement.classList.remove('lock');
      document.body.classList.remove('lock');
      setTimeout(function () {
        loader.classList.add('gone');
        var b = $('#nav .brand');
        if (b) b.classList.add('show');
        startHeroIntro();
      }, 950);
    });
  }

  function typeText(el, text, speed, cb) {
    var i = 0;
    var caret = document.createElement('i');
    caret.className = 'caret';
    el.appendChild(caret);
    (function tick() {
      if (i <= text.length) {
        el.childNodes[0].nodeValue = text.slice(0, i);
        i++;
        setTimeout(tick, speed);
      } else if (cb) { cb(caret); }
    })();
  }

  function runLoader() {
    if (!loader) return;
    document.documentElement.classList.add('lock');
    document.body.classList.add('lock');

    if (sessionStorage.getItem('el_seen') === '1') {
      loader.classList.add('ready');
      setTimeout(finishLoader, 700);
      return;
    }
    sessionStorage.setItem('el_seen', '1');

    var pct = $('#loader-pct');
    var bar = $('#loader-bar i');
    var man = $('#loader-manifesto');
    var p = 0;
    var target = 0;
    var t0 = performance.now();
    var MIN = 3400;

    requestAnimationFrame(function () { loader.classList.add('ready'); });

    if (man) {
      man.appendChild(document.createTextNode(''));
      setTimeout(function () {
        typeText(man, 'O problema raramente são as pessoas. ', 26, function (caret) {
          caret.remove();
          var l2 = document.createElement('span');
          l2.appendChild(document.createTextNode(''));
          man.appendChild(document.createElement('br'));
          man.appendChild(l2);
          typeText(l2, 'É como a empresa está organizada.', 26, function (c2) {
            setTimeout(function () { c2.remove(); }, 1200);
          });
        });
      }, 650);
    }

    var fontsReady = false;
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { fontsReady = true; });
    } else { fontsReady = true; }

    (function tick(now) {
      var el = (now || performance.now()) - t0;
      target = clamp(el / MIN * 100, 0, fontsReady ? 100 : 92);
      p = lerp(p, target, 0.08);
      if (pct) pct.textContent = ('00' + Math.round(p)).slice(-3) + ' %';
      if (bar) bar.style.width = p + '%';
      if (p > 99.2 && el > MIN) { finishLoader(); return; }
      if (!loaderDone) requestAnimationFrame(tick);
    })();

    loader.addEventListener('click', finishLoader);
  }

  /* Nome que encolhe do loader para a barra (FLIP) */
  function dockName(cb) {
    var from = $('#loader-name');
    var to = $('#nav .brand-txt .brand-name');
    if (!from || !to || from.offsetParent === null) { cb(); return; }
    var f = from.getBoundingClientRect();
    var t = to.getBoundingClientRect();
    if (!f.width || !t.width) { cb(); return; }

    var ghost = document.createElement('div');
    ghost.textContent = 'Eric Leite';
    ghost.style.cssText =
      'position:fixed;z-index:160;left:' + f.left + 'px;top:' + f.top + 'px;' +
      'font-family:var(--sans);font-weight:900;letter-spacing:-0.045em;line-height:.92;' +
      'font-size:' + parseFloat(getComputedStyle(from).fontSize) + 'px;color:var(--txt-light);' +
      'transform-origin:left top;pointer-events:none;white-space:nowrap;';
    document.body.appendChild(ghost);
    from.style.opacity = '0';

    var g = ghost.getBoundingClientRect();
    var scale = t.height / g.height * 1.35;
    var dx = t.left - g.left;
    var dy = t.top - g.top;
    ghost.style.transition = 'transform .85s cubic-bezier(.65,0,.35,1), opacity .3s .75s';
    requestAnimationFrame(function () {
      ghost.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(' + scale + ')';
      ghost.style.opacity = '0';
    });
    setTimeout(function () { ghost.remove(); }, 1000);
    setTimeout(cb, 260);
  }

  /* ============================================================
     2 · CURSOR (bolinha)
     ============================================================ */
  (function cursor() {
    if (touch) return;
    var c = $('#cursor');
    if (!c) return;
    var tag = c.querySelector('.cursor-tag');
    var x = -100, y = -100, cx = -100, cy = -100;
    document.addEventListener('mousemove', function (e) { x = e.clientX; y = e.clientY; });
    (function loop() {
      cx = lerp(cx, x, 0.2);
      cy = lerp(cy, y, 0.2);
      var half = c.offsetWidth / 2;
      c.style.transform = 'translate(' + (cx - half) + 'px,' + (cy - half) + 'px)';
      requestAnimationFrame(loop);
    })();
    document.addEventListener('mouseover', function (e) {
      var t = e.target.closest('[data-cursor]');
      var link = e.target.closest('a, button, .case-card, .rep-card');
      if (t) {
        c.classList.add('grow');
        if (tag) tag.textContent = t.getAttribute('data-cursor');
      } else if (link) {
        c.classList.add('grow');
        if (tag) tag.textContent = '';
      } else {
        c.classList.remove('grow');
      }
      c.classList.toggle('hide', !!e.target.closest('#field-canvas, #radar-canvas'));
    });
    document.addEventListener('mouseleave', function () { c.classList.add('hide'); });
    document.addEventListener('mouseenter', function () { c.classList.remove('hide'); });
  })();

  /* ============================================================
     3 · NAV
     ============================================================ */
  (function nav() {
    var bar = $('#nav');
    if (!bar) return;
    var lastY = 0;
    var lightSections = $$('[data-bar="light"]');
    function onScroll() {
      var y = window.scrollY;
      bar.classList.toggle('scrolled', y > 40);
      lastY = y; /* a barra fica sempre visível: navegação é âncora, não distração */

      var probe = 32;
      var light = false;
      for (var i = 0; i < lightSections.length; i++) {
        var r = lightSections[i].getBoundingClientRect();
        if (r.top <= probe && r.bottom >= probe) { light = true; break; }
      }
      bar.classList.toggle('on-light-bar', light);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    var burger = $('#burger');
    var menu = $('#mobile-menu');
    if (burger && menu) {
      burger.addEventListener('click', function () {
        var open = menu.classList.toggle('open');
        burger.classList.toggle('open', open);
        document.body.classList.toggle('lock', open);
      });
      $$('a', menu).forEach(function (a) {
        a.addEventListener('click', function () {
          menu.classList.remove('open');
          burger.classList.remove('open');
          document.body.classList.remove('lock');
        });
      });
    }

    var links = $$('.nav-link');
    var secs = links.map(function (l) { return $(l.getAttribute('href')); });
    window.addEventListener('scroll', function () {
      var y = window.scrollY + window.innerHeight * 0.35;
      var idx = -1;
      secs.forEach(function (s, i) { if (s && s.offsetTop <= y) idx = i; });
      links.forEach(function (l, i) { l.classList.toggle('active', i === idx); });
    }, { passive: true });
  })();

  /* ============================================================
     4 · HERO · fit da headline + encolhimento no scroll
     ============================================================ */
  var heroIntroDone = false;
  function startHeroIntro() {
    if (heroIntroDone) return;
    heroIntroDone = true;
    $$('#inicio .rv, #inicio .rv-stagger').forEach(function (el) { el.classList.add('in'); });
  }

  (function heroFit() {
    var lines = $$('#hero-headline .fit-line');
    var box = $('.hero-inner');
    if (!lines.length || !box) return;
    var lastW = -1;
    function fit(force) {
      var w = box.clientWidth;
      if (!force && w === lastW) return;
      lastW = w;
      lines.forEach(function (ln) {
        ln.style.transition = 'none'; /* medição imune a transições globais */
        ln.style.fontSize = '100px';
        var natural = ln.getBoundingClientRect().width;
        if (natural > 0) ln.style.fontSize = clamp(100 * (w / natural) * 0.88, 30, 210) + 'px';
      });
    }
    fit(true);
    /* ResizeObserver reage à largura real do container (pós-layout),
       cobrindo resize, rotação e mudança de barra de rolagem. */
    if ('ResizeObserver' in window) {
      var ro = new ResizeObserver(function () { fit(); });
      ro.observe(box);
    } else {
      window.addEventListener('resize', function () { fit(true); });
    }
    window.addEventListener('orientationchange', function () { setTimeout(function () { fit(true); }, 120); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { fit(true); });
    setTimeout(function () { fit(true); }, 300);

    if (reducedOS) return; /* parallax preso ao scroll: respeita o sistema */
    var head = $('#hero-headline');
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      var h = window.innerHeight;
      var t = clamp(y / h, 0, 1);
      head.style.transform = 'translateY(' + y * 0.18 + 'px) scale(' + (1 - t * 0.1) + ')';
      head.style.transformOrigin = 'left top';
      head.style.opacity = String(1 - t * 0.55);
    }, { passive: true });
  })();

  /* ============================================================
     5 · PRANCHETA DE JOGADAS · estratégia e tática
     Rotas se desenham e se apagam como giz num quadro de
     treinador: X, O, setas. Cada traço nasce, percorre o
     caminho e some pela cauda; a rota principal renasce
     mirando o cursor, com o círculo do "ponto que ninguém
     calculou" pulsando no alvo.
     ============================================================ */
  (function playbook() {
    var cv = $('#field-canvas');
    if (!cv) return;
    var ctx = cv.getContext('2d', { alpha: false });
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0;
    var running = true;
    var last = 0;
    var STEP = 1000 / 30;
    var seed = 11;
    function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }

    var CHALK = '232,229,223';
    var BLUE = '125,151,255';
    var pointer = { x: -1, y: -1 };
    var plays = [];
    var marks = [];
    /* zonas do texto do hero: a prancheta desenha em volta, nunca em cima.
       São as caixas reais de título, parágrafo e botões, não o bloco inteiro:
       assim a coluna à direita e os vãos entre eles ficam livres para a animação. */
    var EXS = [];
    var EX = null; /* compatibilidade: alguma checagem usa uma caixa só */
    function inEx(x, y) {
      for (var i = 0; i < EXS.length; i++) {
        var z = EXS[i];
        if (x > z.x0 && x < z.x1 && y > z.y0 && y < z.y1) return true;
      }
      return false;
    }

    /* durações (frames a ~30fps) */
    var DX = 9, DO = 9, HOLD = 14, FADE = 16;
    var TICK = 0;

    /* a curva inteira precisa passar longe do texto, não só as pontas */
    function curvaLimpa(pts) {
      if (!EXS.length) return true;
      for (var k = 0; k < pts.length; k++) if (inEx(pts[k][0], pts[k][1])) return false;
      return true;
    }

    function qcurve(x1, y1, x2, y2, bend) {
      var pts = [], k, u, X, Y;
      var cx = (x1 + x2) / 2 + bend;
      var cy = (y1 + y2) / 2 + bend * 0.6;
      for (k = 0; k <= 28; k++) {
        u = k / 28;
        X = (1 - u) * (1 - u) * x1 + 2 * (1 - u) * u * cx + u * u * x2;
        Y = (1 - u) * (1 - u) * y1 + 2 * (1 - u) * u * cy + u * u * y2;
        pts.push([X, Y]);
      }
      return pts;
    }

    function xShape(x, y, s, prog, alpha) {
      ctx.lineWidth = 2.2;
      ctx.setLineDash([]);
      ctx.strokeStyle = 'rgba(' + CHALK + ',' + alpha.toFixed(3) + ')';
      var p1 = clamp(prog * 2, 0, 1);
      var p2 = clamp(prog * 2 - 1, 0, 1);
      ctx.beginPath();
      ctx.moveTo(x - s, y - s);
      ctx.lineTo(x - s + 2 * s * p1, y - s + 2 * s * p1);
      ctx.stroke();
      if (p2 > 0) {
        ctx.beginPath();
        ctx.moveTo(x + s, y - s);
        ctx.lineTo(x + s - 2 * s * p2, y - s + 2 * s * p2);
        ctx.stroke();
      }
    }

    function oShape(x, y, r, prog, alpha, blue) {
      ctx.lineWidth = 2.2;
      ctx.setLineDash([]);
      ctx.strokeStyle = 'rgba(' + (blue ? BLUE : CHALK) + ',' + alpha.toFixed(3) + ')';
      ctx.beginPath();
      ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * clamp(prog, 0, 1));
      ctx.stroke();
    }

    function arrowHead(p2, p1, alpha, blue, w) {
      var ang = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
      var hs = 12;
      ctx.lineWidth = w;
      ctx.setLineDash([]);
      ctx.strokeStyle = 'rgba(' + (blue ? BLUE : CHALK) + ',' + alpha.toFixed(3) + ')';
      ctx.beginPath();
      ctx.moveTo(p2[0], p2[1]);
      ctx.lineTo(p2[0] - Math.cos(ang - 0.45) * hs, p2[1] - Math.sin(ang - 0.45) * hs);
      ctx.moveTo(p2[0], p2[1]);
      ctx.lineTo(p2[0] - Math.cos(ang + 0.45) * hs, p2[1] - Math.sin(ang + 0.45) * hs);
      ctx.stroke();
    }

    function sweepLine(pts, prog, alpha, blue, dashed, w, withHead) {
      var upto = Math.max(1, Math.round(clamp(prog, 0, 1) * (pts.length - 1)));
      ctx.lineWidth = w;
      if (dashed) {
        ctx.setLineDash([7, 8]);
        ctx.lineDashOffset = reducedOS ? 0 : -TICK * 0.9; /* o tracejado corre dentro da rota */
      } else {
        ctx.setLineDash([]);
      }
      ctx.strokeStyle = 'rgba(' + (blue ? BLUE : CHALK) + ',' + alpha.toFixed(3) + ')';
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (var k = 1; k <= upto; k++) ctx.lineTo(pts[k][0], pts[k][1]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.lineDashOffset = 0;
      if (withHead && prog > 0.06) arrowHead(pts[upto], pts[Math.max(upto - 1, 0)], alpha, blue, w);
    }

    /* vinheta: X aparece, O aparece, a linha varre de X a O.
       Variante cone: do X, um leque de rotas varre até cenários,
       e um deles é o escolhido. */
    /* a região livre do hero, à direita e abaixo do texto, concentra a maior parte das jogadas */
    function xZona() { return W * (0.40 + rnd() * 0.56); }
    function yZona() { return H * (0.52 + rnd() * 0.44); }
    var P_ZONA = 0.62;

    /* respiro entre jogadas: sem isso as setas nascem coladas e viram emaranhado */
    var GAP = 150;
    function longeDasOutras(p, x, y) {
      for (var i = 0; i < plays.length; i++) {
        var o = plays[i];
        if (o === p || o.x1 == null) continue;
        if (Math.abs(o.x1 - x) < GAP && Math.abs(o.y1 - y) < GAP) return false;
        if (o.x2 != null && Math.abs(o.x2 - x) < GAP && Math.abs(o.y2 - y) < GAP) return false;
      }
      return true;
    }

    function spawnPlay(p, principal) {
      /* com o cursor na tela, a maioria das vinhetas nasce na região dele */
      var nearCursor = pointer.x > 0 && (principal || rnd() < 0.45);
      var x1, y1;
      if (nearCursor) {
        var ar = 90 + rnd() * 300;
        var aa = rnd() * Math.PI * 2;
        x1 = clamp(pointer.x + Math.cos(aa) * ar, 24, W - 24);
        y1 = clamp(pointer.y + Math.sin(aa) * ar, 24, H - 24);
      } else {
        var naZona = rnd() < P_ZONA;
        var tent = 0;
        do {
          if (naZona) { x1 = xZona(); y1 = yZona(); }
          else { x1 = W * (0.04 + rnd() * 0.92); y1 = H * (0.03 + rnd() * 0.9); }
          tent++;
        } while ((inEx(x1, y1) || !longeDasOutras(p, x1, y1)) && tent < 16);
      }
      p.x1 = x1; p.y1 = y1;
      p.principal = principal;
      p.hunter = principal || (pointer.x > 0 && rnd() < 0.35);
      var roll = rnd();
      p.kind = (principal || p.hunter) ? 'link'
        : roll < 0.16 ? 'cone'
        : roll < 0.26 ? 'target'
        : roll < 0.34 ? 'star'
        : 'link'; /* maioria vira rota com seta */
      p.t = 0;
      p.delay = principal ? 0 : Math.floor(rnd() * 70);
      if (p.kind === 'target' || p.kind === 'star') {
        p.sweepDur = 30;
      } else if (p.kind === 'cone') {
        var base = rnd() * Math.PI * 2;
        var spread = 0.4 + rnd() * 0.3;
        var nl = 3, i;
        p.pick = Math.floor(rnd() * nl);
        p.tips = [];
        p.lines = [];
        for (i = 0; i < nl; i++) {
          var ang = base + (i - (nl - 1) / 2) * spread;
          var rad = 140 + rnd() * 130;
          p.tips.push([clamp(x1 + Math.cos(ang) * rad, 20, W - 20),
                       clamp(y1 + Math.sin(ang) * rad, 20, H - 20)]);
        }
        for (i = 0; i < nl; i++) {
          var lc = null, tl = 0;
          do {
            lc = qcurve(x1, y1, p.tips[i][0], p.tips[i][1], (rnd() - 0.5) * 60);
            tl++;
          } while (!curvaLimpa(lc) && tl < 10);
          p.lines.push(lc);
        }
        p.sweepDur = 46 + Math.floor(rnd() * 20);
      } else {
        var x2, y2;
        if (principal && pointer.x > 0) { x2 = pointer.x; y2 = pointer.y; }
        else if (p.hunter && pointer.x > 0) {
          /* caçadoras: convergem para a vizinhança do cursor */
          x2 = clamp(pointer.x + (rnd() - 0.5) * 140, 26, W - 26);
          y2 = clamp(pointer.y + (rnd() - 0.5) * 140, 26, H - 26);
        }
        else {
          var t2 = 0;
          do {
            x2 = clamp(x1 + (rnd() - 0.5) * W * 0.44, 26, W - 26);
            y2 = clamp(y1 + (rnd() - 0.5) * H * 0.55, 26, H - 26);
            if (naZona) { y2 = clamp(y2, H * 0.30, H - 26); }
            t2++;
          } while ((inEx(x2, y2) || !longeDasOutras(p, x2, y2)) && t2 < 16);
        }
        p.x2 = x2; p.y2 = y2;
        var tc = 0;
        do {
          p.pts = qcurve(x1, y1, x2, y2, (rnd() - 0.5) * 140);
          tc++;
        } while (!curvaLimpa(p.pts) && tc < 12);
        /* não escapou do texto: tenta outros pares de pontos antes de desistir da seta */
        var tent2 = 0;
        while (!curvaLimpa(p.pts) && tent2 < 14) {
          x1 = W * (0.03 + rnd() * 0.94); y1 = H * (0.03 + rnd() * 0.92);
          x2 = clamp(x1 + (rnd() - 0.5) * W * 0.5, 24, W - 24);
          y2 = clamp(y1 + (rnd() - 0.5) * H * 0.5, 24, H - 24);
          p.pts = qcurve(x1, y1, x2, y2, (rnd() - 0.5) * 110);
          tent2++;
        }
        p.x1 = x1; p.y1 = y1; p.x2 = x2; p.y2 = y2;
        if (!curvaLimpa(p.pts)) { p.delay = 8 + Math.floor(rnd() * 24); p.t = 0; }
        p.dashed = !principal && rnd() > 0.55;
        p.sweepDur = 44 + Math.floor(rnd() * 24);
      }
    }

    function drawPlay(p) {
      if (p.delay > 0) { p.delay--; return; }
      p.t += reducedOS ? 0.6 : 1; /* movimento reduzido: mais devagar, nunca parado */
      var t = p.t;
      var sweepEnd = DX + DO + p.sweepDur;
      var total = sweepEnd + HOLD + FADE;
      if (t >= total) { spawnPlay(p, p.principal); return; }
      var g = t > sweepEnd + HOLD ? 1 - (t - sweepEnd - HOLD) / FADE : 1;
      var blue = p.principal;

      if (p.kind === 'target') {
        /* alvo concêntrico: a estratégia escolhe onde mirar */
        var radii = [24, 16, 8];
        for (var ri = 0; ri < 3; ri++) {
          var pr = clamp((t - ri * 8) / 8, 0, 1);
          if (pr > 0) oShape(p.x1, p.y1, radii[ri], pr, 0.34 * g, false);
        }
        if (t > 26) {
          ctx.fillStyle = 'rgba(' + BLUE + ',' + (0.7 * g).toFixed(3) + ')';
          ctx.beginPath();
          ctx.arc(p.x1, p.y1, 3, 0, Math.PI * 2);
          ctx.fill();
        }
        return;
      }
      if (p.kind === 'star') {
        /* estrela-norte: a direção antes do movimento */
        var spr = clamp(t / 12, 0, 1);
        var L1 = 14 * spr, L2 = 8 * spr;
        ctx.lineWidth = 2.1;
        ctx.setLineDash([]);
        ctx.strokeStyle = 'rgba(' + CHALK + ',' + (0.4 * g).toFixed(3) + ')';
        ctx.beginPath();
        ctx.moveTo(p.x1, p.y1 - L1); ctx.lineTo(p.x1, p.y1 + L1);
        ctx.moveTo(p.x1 - L1, p.y1); ctx.lineTo(p.x1 + L1, p.y1);
        ctx.moveTo(p.x1 - L2, p.y1 - L2); ctx.lineTo(p.x1 + L2, p.y1 + L2);
        ctx.moveTo(p.x1 - L2, p.y1 + L2); ctx.lineTo(p.x1 + L2, p.y1 - L2);
        ctx.stroke();
        return;
      }

      /* 1 · o X aparece */
      xShape(p.x1, p.y1, 12, t / DX, 0.5 * g);
      if (t <= DX) return;

      if (p.kind === 'cone') {
        var prog = clamp((t - DX) / p.sweepDur, 0, 1);
        for (var i = 0; i < p.lines.length; i++) {
          var chosen = i === p.pick;
          sweepLine(p.lines[i], prog, (chosen ? 0.42 : 0.16) * g, chosen, false, chosen ? 2.2 : 1.6, chosen);
          if (prog >= 1) oShape(p.tips[i][0], p.tips[i][1], 4.5, 1, (chosen ? 0.5 : 0.2) * g, chosen);
        }
        if (prog >= 1) {
          var ra = 11 + Math.sin(t * 0.12) * 1.6;
          ctx.setLineDash([4, 5]);
          ctx.lineWidth = 1.8;
          ctx.strokeStyle = 'rgba(' + BLUE + ',' + (0.45 * g).toFixed(3) + ')';
          ctx.beginPath();
          ctx.arc(p.tips[p.pick][0], p.tips[p.pick][1], ra, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      } else {
        /* 2 · o O aparece */
        oShape(p.x2, p.y2, 12, (t - DX) / DO, 0.5 * g, blue);
        if (t <= DX + DO) return;
        /* 3 · a linha varre de X a O */
        var prog2 = clamp((t - DX - DO) / p.sweepDur, 0, 1);
        sweepLine(p.pts, prog2, (blue ? 0.5 : 0.32) * g, blue, p.dashed, blue ? 2.3 : 1.9, true);
        /* 4 · o ponto que ninguém calculou pulsa no alvo */
        if ((blue || p.hunter) && prog2 >= 1) {
          var rb = 12 + Math.sin(t * 0.12) * 1.8;
          ctx.setLineDash([4, 5]);
          ctx.lineWidth = 1.9;
          ctx.strokeStyle = 'rgba(' + BLUE + ',' + ((blue ? 0.55 : 0.3) * g).toFixed(3) + ')';
          ctx.beginPath();
          ctx.arc(p.x2, p.y2, rb, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }
    }

    function spawnMark(m) {
      m.t = rnd() > 0.45 ? 'x' : 'o';
      var mz = rnd() < P_ZONA;
      var tm = 0;
      do {
        if (mz) { m.x = xZona(); m.y = yZona(); }
        else { m.x = W * (0.03 + rnd() * 0.94); m.y = H * (0.02 + rnd() * 0.94); }
        tm++;
      } while (inEx(m.x, m.y) && tm < 9);
      m.phase = 0;
      m.speed = 0.006 + rnd() * 0.008;
      m.peak = 0.1 + rnd() * 0.16;
      m.wait = Math.floor(rnd() * 90);
    }

    function drawMarkLife(m) {
      if (m.wait > 0) { m.wait--; return; }
      m.phase += m.speed;
      if (m.phase >= 1) { spawnMark(m); return; }
      var a = m.phase < 0.25 ? m.phase / 0.25
            : m.phase > 0.72 ? (1 - m.phase) / 0.28
            : 1;
      if (m.t === 'x') xShape(m.x, m.y, 10, 1, m.peak * a);
      else oShape(m.x, m.y, 10, 1, m.peak * a, false);
    }

    function frame(now) {
      if (!running) return;
      now = now || 0;
      if (now - last < STEP) { requestAnimationFrame(frame); return; }
      last = now;
      TICK++;
      ctx.fillStyle = '#0b0b0a';
      ctx.fillRect(0, 0, W, H);
      var i;
      for (i = 0; i < marks.length; i++) drawMarkLife(marks[i]);
      for (i = 0; i < plays.length; i++) drawPlay(plays[i]);
      requestAnimationFrame(frame);
    }

    function resize() {
      var r = cv.parentElement.getBoundingClientRect();
      W = r.width; H = r.height;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#0b0b0a';
      ctx.fillRect(0, 0, W, H);
      var cr = cv.getBoundingClientRect();
      EXS = [];
      ['#hero-headline', '.hero-sub', '.hero-ctas', '.scroll-hint', '#nav'].forEach(function (sel) {
        var el = document.querySelector(sel);
        if (!el) return;
        var b = el.getBoundingClientRect();
        if (!b.width) return;
        var m = 26;
        EXS.push({ x0: b.left - cr.left - m, y0: b.top - cr.top - m,
                   x1: b.right - cr.left + m, y1: b.bottom - cr.top + m });
      });
      EX = EXS[0] || null;
      seed = 11;
      plays = [];
      var np = W > 900 ? 4 : 2; /* poucas jogadas por vez: leitura clara, sem emaranhado */
      var i;
      for (i = 0; i < np; i++) {
        var pl = {};
        spawnPlay(pl, i === 0);
        if (i > 0) pl.delay = Math.floor(rnd() * 130);
        plays.push(pl);
      }
      marks = [];
      var nm = Math.round(clamp(W * H / 320000, 2, 4));
      for (i = 0; i < nm; i++) {
        var mk = {};
        spawnMark(mk);
        mk.phase = rnd() * 0.8;
        mk.wait = 0;
        marks.push(mk);
      }
    }

    function pos(e) {
      var r = cv.getBoundingClientRect();
      var s = e.touches ? e.touches[0] : e;
      return { x: s.clientX - r.left, y: s.clientY - r.top };
    }
    cv.addEventListener('mousemove', function (e) { var p = pos(e); pointer.x = p.x; pointer.y = p.y; });
    cv.addEventListener('mouseleave', function () { pointer.x = -1; pointer.y = -1; });
    cv.addEventListener('touchmove', function (e) { var p = pos(e); pointer.x = p.x; pointer.y = p.y; }, { passive: true });
    cv.addEventListener('touchend', function () { pointer.x = -1; pointer.y = -1; });

    var io = new IntersectionObserver(function (en) {
      var vis = en[0].isIntersecting;
      if (vis && !running) { running = true; last = 0; requestAnimationFrame(frame); }
      else if (!vis) running = false;
    });
    io.observe(cv);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { running = false; }
      else if (cv.getBoundingClientRect().bottom > 0 && cv.getBoundingClientRect().top < innerHeight) {
        running = true; last = 0; requestAnimationFrame(frame);
      }
    });

    resize();
    window.addEventListener('resize', resize);
    requestAnimationFrame(frame);
  })();

  /* ============================================================
     5c · CONTATO · formulário que aparece no clique do e-mail
     ============================================================ */
  (function contatoForm() {
    var form = $('#contato-form');
    if (!form) return;
    var toggle = $('#email-toggle');
    var openedAt = 0;
    if (toggle) toggle.addEventListener('click', function (e) {
      e.preventDefault();
      form.hidden = !form.hidden;
      if (!form.hidden) { openedAt = Date.now(); $('#cf-nome').focus(); }
    });
    /* e-mail corporativo: provedores pessoais ficam de fora */
    var PESSOAIS = ['gmail.com', 'googlemail.com', 'outlook.com', 'outlook.com.br', 'hotmail.com',
      'hotmail.com.br', 'live.com', 'msn.com', 'yahoo.com', 'yahoo.com.br', 'ymail.com',
      'icloud.com', 'me.com', 'aol.com', 'bol.com.br', 'uol.com.br', 'terra.com.br',
      'ig.com.br', 'globo.com', 'proton.me', 'protonmail.com', 'zoho.com', 'gmx.com', 'mail.com'];
    function dominioPessoal(v) {
      var d = (v.split('@')[1] || '').toLowerCase().trim();
      return PESSOAIS.indexOf(d) > -1;
    }
    var campoEmail = $('#cf-email');
    if (campoEmail) campoEmail.addEventListener('input', function () {
      campoEmail.classList.remove('cf-erro');
      if ($('#cf-status').textContent.indexOf('corporativo') > -1) $('#cf-status').textContent = '';
    });

    form.addEventListener('submit', function (e) {
      /* proteção invisível: bot envia em milissegundos, gente não */
      if (!openedAt || Date.now() - openedAt < 3000) {
        e.preventDefault();
        if (!openedAt) openedAt = Date.now();
        $('#cf-status').textContent = 'confere os campos e envia de novo.';
        return;
      }
      if (campoEmail && dominioPessoal(campoEmail.value)) {
        e.preventDefault();
        campoEmail.classList.add('cf-erro');
        campoEmail.focus();
        $('#cf-status').textContent = 'use o e-mail corporativo, por favor. se você não tem um, me chame pelo WhatsApp ou pelo LinkedIn.';
      }
    });
    if (location.search.indexOf('enviado=1') > -1) {
      var ok = document.createElement('p');
      ok.className = 'cota on-light';
      ok.textContent = 'mensagem enviada. obrigado, respondo em breve.';
      form.parentElement.insertBefore(ok, form);
    }
  })();

  /* ============================================================
     5c2 · ATOS · agrupadores que abrem
     ============================================================ */
  (function atos() {
    $$('.ato-card, .prob').forEach(function (card) {
      function alterna() {
        var aberto = card.classList.toggle('open');
        card.setAttribute('aria-expanded', aberto ? 'true' : 'false');
      }
      card.addEventListener('click', alterna);
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); alterna(); }
      });
    });
  })();

  /* ============================================================
     5c3 · LOOP CAUSAL · variáveis clicáveis com caixa ao lado
     ============================================================ */
  (function loopCausal() {
    var wrap = document.querySelector('.loop-wrap');
    if (!wrap) return;
    var svg = wrap.querySelector('.loop-svg');
    var nos = $$('.mp-no, .mp-x', wrap);
    var linhas = $$('.mp-arco, .mp-ponte', wrap);
    var xligs = $$('.mp-x-lig', wrap);
    var selos = $$('.mp-selo', wrap);
    var pops = $$('.loop-pop', wrap);
    var travado = null, modo = 'limpo';

    function cls(el, nome, liga) {
      var l = (el.getAttribute('class') || '').split(' ').filter(function (c) { return c && c !== nome; });
      if (liga) l.push(nome);
      el.setAttribute('class', l.join(' '));
    }
    function no(v) { return wrap.querySelector('.mp-no[data-v="' + v + '"], .mp-x[data-v="' + v + '"]'); }

    /* ---- realce das relações ---- */
    function limpaRealce() {
      cls(svg, 'foco', false); cls(svg, 'so', false);
      nos.concat(linhas, selos).forEach(function (e) { cls(e, 'rel', false); cls(e, 'ori', false); });
    }
    function realca(alvo) {
      var v = alvo.getAttribute('data-v'), anel = alvo.getAttribute('data-anel');
      limpaRealce();
      cls(svg, 'foco', true);
      cls(alvo, 'rel', true); cls(alvo, 'ori', true);
      if (v === 'elefante') {
        selos.forEach(function (e) { cls(e, 'rel', true); });
        xligs.forEach(function (e) { cls(e, 'rel', true); });
        return;
      }
      /* só as ligações que tocam esta variável, e a variável do outro lado */
      linhas.forEach(function (l) {
        var de = l.getAttribute('data-de'), para = l.getAttribute('data-para');
        if (de !== v && para !== v) return;
        cls(l, 'rel', true);
        var outro = no(de === v ? para : de);
        if (outro) cls(outro, 'rel', true);
      });
      var sel = wrap.querySelector('.mp-selo[data-anel="' + anel + '"]');
      if (sel) cls(sel, 'rel', true);
    }

    /* ---- caixa ---- */
    function fecha() {
      nos.forEach(function (n) { cls(n, 'on', false); n.setAttribute('aria-expanded', 'false'); });
      pops.forEach(function (p) { p.classList.remove('on'); });
      travado = null;
      aplicaModo();
    }
    function abre(alvo) {
      var jaAberto = travado === alvo;
      fecha();
      if (jaAberto) return;
      travado = alvo;
      cls(alvo, 'on', true);
      alvo.setAttribute('aria-expanded', 'true');
      var pop = wrap.querySelector('.loop-pop[data-pop="' + alvo.getAttribute('data-v') + '"]');
      if (pop) pop.classList.add('on');
      realca(alvo);
    }
    function alvoDe(e) {
      var n = e.target;
      while (n && n !== wrap) {
        if (n.getAttribute && n.getAttribute('data-v')) return n;
        n = n.parentNode;
      }
      return null;
    }

    wrap.addEventListener('mouseover', function (e) {
      if (travado) return;
      var a = alvoDe(e);
      if (a) realca(a); else aplicaModo();
    });
    wrap.addEventListener('mouseleave', function () {
      if (travado) return;
      aplicaModo();
    });
    wrap.addEventListener('click', function (e) {
      var a = alvoDe(e);
      if (a) { e.stopPropagation(); abre(a); }
    });
    wrap.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var a = alvoDe(e);
      if (a) { e.preventDefault(); abre(a); }
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest || !e.target.closest('.loop-pop, .mp-filtro')) fecha();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fecha(); });

    /* ---- modos: limpo (so variaveis) | tudo | um ciclo ---- */
    var ANELDE = {};
    $$('.mp-no', wrap).forEach(function (n) { ANELDE[n.getAttribute('data-v')] = n.getAttribute('data-anel'); });

    function aplicaModo() {
      limpaRealce();
      cls(svg, 'limpo', modo === 'limpo');
      cls(svg, 'so', !!modo && modo !== 'limpo');
      if (modo === 'limpo' || modo === '') return;
      nos.concat(linhas, selos, xligs).forEach(function (e) {
        var meu = e.getAttribute('data-anel');
        var de = e.getAttribute('data-de'), para = e.getAttribute('data-para');
        cls(e, 'rel', meu === modo || (de && ANELDE[de] === modo && para && ANELDE[para] === modo));
      });
    }

    $$('.mp-filtro .mp-f').forEach(function (b) {
      b.addEventListener('click', function () {
        $$('.mp-filtro .mp-f').forEach(function (o) { o.classList.remove('on'); });
        b.classList.add('on');
        modo = b.getAttribute('data-f');
        travado = null;
        nos.forEach(function (n) { cls(n, 'on', false); n.setAttribute('aria-expanded', 'false'); });
        pops.forEach(function (p) { p.classList.remove('on'); });
        aplicaModo();
      });
    });
  })();

  /* ============================================================
     5d · VOZES · carrossel de depoimentos
     ============================================================ */
  (function vozes() {
    var track = $('#vozes-track');
    if (!track) return;
    var idx = 0;
    /* clona a lista uma vez: o fim emenda no começo sem salto visível */
    var orig = track.children.length;
    for (var k = 0; k < orig; k++) track.appendChild(track.children[k].cloneNode(true));

    function perView() { return window.innerWidth > 980 ? 3 : 1; }
    function render(instantaneo) {
      if (idx < 0) idx = 0;
      var card = track.children[0];
      if (!card) return;
      var step = card.getBoundingClientRect().width + 24; /* card + gap */
      track.style.transition = instantaneo ? 'none' : '';
      track.style.transform = 'translateX(' + (-idx * step) + 'px)';
      if (instantaneo) { void track.offsetWidth; track.style.transition = ''; }
    }
    var next = $('#vz-next'), prev = $('#vz-prev');
    if (next) next.addEventListener('click', function () { idx++; render(); });
    if (prev) prev.addEventListener('click', function () { idx--; render(); });
    window.addEventListener('resize', render);
    render();

    /* anda sozinho; para quando o visitante encosta ou sai da tela */
    var caixa = track.closest('.vozes-carrossel');
    var pausado = false, visivel = false;
    if (caixa) {
      caixa.addEventListener('mouseenter', function () { pausado = true; });
      caixa.addEventListener('mouseleave', function () { pausado = false; });
      caixa.addEventListener('touchstart', function () { pausado = true; }, { passive: true });
    }
    new IntersectionObserver(function (en) { visivel = en[0].isIntersecting; })
      .observe(track.parentElement);
    setInterval(function () {
      if (pausado || !visivel) return;
      idx++;
      render();
      /* passou da lista original: volta ao início sem transição, ninguém vê */
      if (idx >= orig) setTimeout(function () { idx -= orig; render(true); }, 560);
    }, 4200);
  })();

  /* ============================================================
     6 · REPERTÓRIO · expandir card
     ============================================================ */
  (function repertorio() {
    $$('.rep-card').forEach(function (card) {
      card.setAttribute('tabindex', '0');
      function toggle() {
        var was = card.classList.contains('open');
        if (!touch) $$('.rep-card').forEach(function (c) { if (c !== card) c.classList.remove('open'); });
        card.classList.toggle('open', !was);
      }
      card.addEventListener('click', toggle);
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
      });
    });
  })();

  /* ============================================================
     6b · ONDE PASSEI · marquee de logos
     Wordmark por padrão; vira logo real se existir
     assets/img/logos/<slug>.svg (basta soltar o arquivo).
     ============================================================ */
  (function logos() {
    var track = $('#logo-track');
    if (!track) return;
    var COMPANIES = [
      ['seguros-unimed', 'Seguros Unimed'], ['natura', 'Natura'], ['rede', 'Rede'],
      ['carrefour', 'Carrefour'], ['google', 'Google'], ['vale', 'Vale'],
      ['braskem', 'Braskem'], ['smiles', 'Smiles'], ['bny-mellon', 'BNY Mellon'],
      ['te-connectivity', 'TE Connectivity'], ['siemens', 'Siemens'], ['voith', 'Voith'],
      ['t-systems', 'T-Systems'], ['mercedes-benz', 'Mercedes-Benz'], ['gm', 'GM'],
      ['multiplan', 'Multiplan'], ['banqi', 'BanQi'], ['b3', 'B3'],
      ['health-angels', 'Health Angels'], ['softex', 'SOFTEX'], ['general-mills', 'General Mills'],
      ['banco-rendimento', 'Banco Rendimento'], ['portobello', 'Portobello Shop'],
      ['espm', 'ESPM'], ['fiap', 'FIAP'], ['bunzl', 'Bunzl'], ['posigraf', 'Posigraf'],
      ['piracanjuba', 'Piracanjuba'], ['infosys', 'Infosys'],
      ['gft', 'GFT'], ['fia', 'FIA'], ['emae', 'EMAE'], ['unicred', 'Unicred'],
      ['mooven', 'Mooven'], ['garagem-criativa', 'Garagem Criativa'], ['echos', 'ECHOS'],
      ['bepo', 'BEPO']
    ];
    function cell(slug, name) {
      var c = document.createElement('span');
      c.className = 'logo-cell';
      c.setAttribute('data-logo', slug);
      var w = document.createElement('span');
      w.className = 'wordmark';
      w.textContent = name;
      c.appendChild(w);
      var img = new Image();
      img.alt = name;
      img.onload = function () {
        /* todas as marcas ocupam a mesma caixa; o CSS encaixa cada uma
           dentro dela sem distorcer, então nenhuma fica maior que a outra */
        w.style.display = 'none';
        c.insertBefore(img, c.firstChild);
      };
      /* mesma query de versão do CSS/JS: troca de logo não fica presa em cache */
      var mv = document.querySelector('meta[name=version]');
      var q = mv ? '?v=' + mv.content : '';
      img.onerror = function () {
        if (img.src.indexOf('.svg') > -1) img.src = 'assets/img/logos/' + slug + '.png' + q;
      };
      img.src = 'assets/img/logos/' + slug + '.svg' + q;
      return c;
    }
    for (var p = 0; p < 2; p++) { /* 2 cópias = loop contínuo sem emenda */
      COMPANIES.forEach(function (co) { track.appendChild(cell(co[0], co[1])); });
    }

    /* esteira manual: desliza sozinha para a esquerda; as setas aceleram */
    var off = 0, boost = 0, dir = 1, running = true;
    var base = reducedOS ? 0.25 : 0.55;
    function step() {
      if (!running) return;
      var half = track.scrollWidth / 2;
      if (half > 0) {
        off = ((off + (base + boost) * dir) % half + half) % half;
        track.style.transform = 'translateX(' + (-off) + 'px)';
      }
      requestAnimationFrame(step);
    }
    function arm(btn, d) {
      if (!btn) return;
      function down(e) { e.preventDefault(); dir = d; boost = 5.5; }
      function up() { boost = 0; dir = 1; }
      btn.addEventListener('mousedown', down);
      btn.addEventListener('touchstart', down, { passive: false });
      btn.addEventListener('mouseup', up);
      btn.addEventListener('mouseleave', up);
      btn.addEventListener('touchend', up);
    }
    arm($('#mq-next'), 1);
    arm($('#mq-prev'), -1);
    var io = new IntersectionObserver(function (en) {
      var vis = en[0].isIntersecting;
      if (vis && !running) { running = true; requestAnimationFrame(step); }
      else if (!vis) running = false;
    });
    io.observe(track.parentElement);
    requestAnimationFrame(step);
  })();

  /* ============================================================
     6c · FOTOS NOS ESTUDOS (opt-in)
     Se existir assets/img/cases/<case>.jpg, a foto entra no
     card e no topo do overlay; senão, fica o diagrama SVG.
     ============================================================ */
  (function casePhotos() {
    $$('.case-card').forEach(function (card) {
      var id = card.getAttribute('data-case');
      var fig = $('.case-fig', card);
      if (!id || !fig) return;
      var img = new Image();
      img.className = 'case-photo';
      img.alt = '';
      img.onload = function () { fig.insertBefore(img, fig.firstChild); fig.classList.add('has-photo'); };
      img.src = 'assets/img/cases/' + id + '.jpg';
    });
  })();

  /* ============================================================
     7 · REVEALS + CONTADORES
     ============================================================ */
  (function reveals() {
    var els = $$('.rv, .rv-stagger');
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (e) {
      if (e.closest('#inicio')) return; /* hero entra via loader */
      io.observe(e);
    });
  })();

  (function counters() {
    var els = $$('[data-count]');
    if (!els.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        var el = en.target;
        var end = parseFloat(el.getAttribute('data-count'));
        var start = parseFloat(el.getAttribute('data-count-start') || '0');
        var prefix = el.getAttribute('data-prefix') || '';
        var suffix = el.getAttribute('data-suffix') || '';
        var t0 = performance.now();
        var dur = 1400;
        (function tick(now) {
          var t = clamp((now - t0) / dur, 0, 1);
          var v = Math.round(lerp(start, end, easeOut(t)));
          el.textContent = prefix + v + suffix;
          if (t < 1) requestAnimationFrame(tick);
        })(t0);
      });
    }, { threshold: 0.5 });
    els.forEach(function (e) { io.observe(e); });
  })();

  /* ============================================================
     8 · RADAR DE FUTUROS (interlúdio)
     ============================================================ */
  (function radar() {
    var cv = $('#radar-canvas');
    if (!cv) return;
    var ctx = cv.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0, CX = 0, CY = 0, R = 0;
    var running = false;
    var sweep = -Math.PI / 2;
    var last = 0;
    var STEP = 1000 / 30;
    var seed = 42;
    function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }

    /* sinais curtos: no máximo duas palavras por ponto */
    var POOL = [
      /* o que dói */
      'cliente perdido', 'custo alto', 'margem apertada', 'projeto atrasado',
      'decisão travada', 'reunião infinita', 'prioridade instável', 'retrabalho constante',
      'silos internos', 'talento saindo', 'sucessão indefinida', 'novo concorrente',
      'regra nova', 'dados dispersos', 'conversa adiada',
      /* o que se busca */
      'decidir rápido', 'priorizar melhor', 'entregar prometido', 'crescer organizado',
      'medir resultado', 'reter talento', 'formar gente', 'integrar áreas',
      'antecipar cenários', 'alinhar diretoria', 'proteger margem', 'destravar decisão',
      'preparar sucessão', 'organizar operação', 'ganhar velocidade', 'focar esforço',
      'governança clara', 'ia aplicada'
    ];
    var poolIdx = -1;
    var blips = [];
    var CAP = null;
    function nextLabel() { poolIdx = (poolIdx + 1) % POOL.length; return POOL[poolIdx]; }
    function mkBlip() {
      return {
        a: rnd() * Math.PI * 2,
        r: (0.25 + rnd() * 0.72) * R,
        s: 1 + rnd() * 2.8,
        label: rnd() > 0.45 ? nextLabel() : null,
        hit: 0,
        life: 1 + Math.floor(rnd() * 2) /* some depois de 1 ou 2 varreduras */
      };
    }

    function layout() {
      var rect = cv.parentElement.getBoundingClientRect();
      W = rect.width; H = rect.height;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      /* zona da legenda: nenhum nome de sinal é escrito ali */
      var cap = document.querySelector('.radar-caption .big');
      if (cap) {
        var cr = cap.getBoundingClientRect();
        var vr = cv.getBoundingClientRect();
        CAP = { x0: cr.left - vr.left - 20, y0: cr.top - vr.top - 16,
                x1: cr.right - vr.left + 20, y1: cr.bottom - vr.top + 16 };
      }
      CX = W / 2; CY = H * 0.56;
      R = Math.min(W * 0.34, H * 0.64);
      seed = 42;
      poolIdx = -1;
      blips = [];
      for (var i = 0; i < 22; i++) blips.push(mkBlip());
    }

    function frame(now) {
      if (!running) return;
      now = now || 0;
      if (now - last < STEP) { requestAnimationFrame(frame); return; }
      last = now;
      ctx.clearRect(0, 0, W, H);
      var rings = [0.33, 0.66, 1];
      ctx.font = '500 9px "JetBrains Mono", monospace';
      ctx.lineWidth = 1.8;
      for (var i = 0; i < rings.length; i++) {
        ctx.strokeStyle = 'rgba(245,243,238,0.17)';
        ctx.beginPath();
        ctx.arc(CX, CY, R * rings[i], 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = 'rgba(245,243,238,0.09)';
      ctx.beginPath(); ctx.moveTo(CX - R, CY); ctx.lineTo(CX + R, CY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(CX, CY - R); ctx.lineTo(CX, CY + R); ctx.stroke();

      sweep += reducedOS ? 0.022 : 0.040;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(CX, CY);
      ctx.arc(CX, CY, R, sweep - 0.5, sweep);
      ctx.closePath();
      var lg = ctx.createLinearGradient(
        CX + Math.cos(sweep - 0.5) * R, CY + Math.sin(sweep - 0.5) * R,
        CX + Math.cos(sweep) * R, CY + Math.sin(sweep) * R
      );
      lg.addColorStop(0, 'rgba(61,99,230,0)');
      lg.addColorStop(1, 'rgba(61,99,230,0.13)');
      ctx.fillStyle = lg;
      ctx.fill();
      ctx.restore();

      ctx.strokeStyle = 'rgba(125,151,255,0.5)';
      ctx.beginPath();
      ctx.moveTo(CX, CY);
      ctx.lineTo(CX + Math.cos(sweep) * R, CY + Math.sin(sweep) * R);
      ctx.stroke();

      for (var b = 0; b < blips.length; b++) {
        var bl = blips[b];
        var da = Math.atan2(Math.sin(bl.a - sweep), Math.cos(bl.a - sweep));
        if (Math.abs(da) < 0.07) { if (bl.hit < 0.5) bl.life--; bl.hit = 1; }
        /* acende na passagem do feixe e apaga logo depois que a sombra sai */
        bl.hit = Math.max(0, bl.hit - 0.026);
        /* sinal esgotado: renasce em outro lugar, com outra palavra */
        if (bl.life <= 0 && bl.hit <= 0.02) { blips[b] = mkBlip(); continue; }
        var x = CX + Math.cos(bl.a) * bl.r;
        var y = CY + Math.sin(bl.a) * bl.r;
        var al = 0.05 + bl.hit * 0.9;
        ctx.beginPath();
        ctx.arc(x, y, bl.s + bl.hit * 1.6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(125,151,255,' + al + ')';
        ctx.fill();
      }
      /* nomes numa camada própria, com anti-colisão: direita, abaixo, esquerda; senão não desenha */
      var placed = [];
      for (var b2 = 0; b2 < blips.length; b2++) {
        var bl2 = blips[b2];
        if (!bl2.label || bl2.hit <= 0.1) continue;
        var lx = CX + Math.cos(bl2.a) * bl2.r;
        var ly = CY + Math.sin(bl2.a) * bl2.r;
        var txt = bl2.label.toUpperCase();
        var tw = ctx.measureText(txt).width;
        var la = Math.min(0.9, bl2.hit * 1.1);
        var bw = tw + 6, bh = 13;
        var alt = [[lx + 7, ly - 7], [lx + 7, ly + 7], [lx - bw - 7, ly - 7]];
        var ok = false, px = 0, py = 0;
        for (var ai = 0; ai < alt.length && !ok; ai++) {
          px = alt[ai][0]; py = alt[ai][1];
          ok = true;
          /* legenda tem prioridade absoluta sobre o nome do sinal */
          if (CAP && px < CAP.x1 && px + bw > CAP.x0 && py < CAP.y1 && py + bh > CAP.y0) ok = false;
          for (var pi = 0; pi < placed.length && ok; pi++) {
            var P = placed[pi];
            if (px < P[0] + P[2] && px + bw > P[0] && py < P[1] + P[3] && py + bh > P[1]) ok = false;
          }
        }
        if (!ok) continue;
        placed.push([px, py, bw, bh]);
        ctx.fillStyle = 'rgba(11,11,10,' + (la * 0.72).toFixed(3) + ')';
        ctx.fillRect(px, py, bw, bh);
        ctx.fillStyle = 'rgba(245,243,238,' + la.toFixed(3) + ')';
        ctx.fillText(txt, px + 3, py + 10);
      }
      requestAnimationFrame(frame);
    }

    var io = new IntersectionObserver(function (en) {
      var vis = en[0].isIntersecting;
      if (vis && !running) { running = true; last = 0; requestAnimationFrame(frame); }
      else if (!vis) running = false;
    });
    io.observe(cv);
    layout();
    window.addEventListener('resize', layout);
  })();

  /* ============================================================
     8b · REDE DE INTERDEPENDÊNCIAS (sobre · como eu penso)
     Nós derivam devagar; as ligações se refazem por proximidade.
     O cursor entra como nó do sistema: pequena intervenção,
     efeito que se propaga.
     ============================================================ */
  $$('#rede-canvas, #rede-canvas-2').forEach(function (canvas) { rede(canvas); });

  function rede(cv) {
    if (!cv) return;
    var sec = cv.closest('section');
    var claro = cv.getAttribute('data-tom') === 'claro';
    var COR_LINHA = claro ? '26,25,23' : '245,243,238';
    var COR_NO = claro ? '26,25,23' : '245,243,238';
    var A_LINHA = claro ? 0.30 : 0.11;
    var A_NO = claro ? 0.62 : 0.38;
    var ctx = cv.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0;
    var running = false;
    var last = 0;
    var STEP = 1000 / 30;
    var seed = 7;
    function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }

    var N = claro ? 260 : 64; /* seção clara: malha mais densa, linhas mais curtas */
    var LINK = 0;
    var CURSOR_LINK = 0;
    var nodes = [];
    var mx = -1e4, my = -1e4;

    function layout() {
      var rect = cv.getBoundingClientRect();
      W = rect.width; H = rect.height;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      LINK = Math.min(Math.min(W, H) * (claro ? 0.1 : 0.2), claro ? 95 : 150);
      CURSOR_LINK = LINK * 1.6;
      seed = 7;
      nodes = [];
      var m = 26;
      for (var i = 0; i < N; i++) {
        nodes.push({
          x: m + rnd() * (W - m * 2),
          y: m + rnd() * (H - m * 2),
          vx: (rnd() - 0.5) * 0.4,
          vy: (rnd() - 0.5) * 0.4,
          ox: 0, oy: 0,
          r: 1.3 + rnd() * 1.5,
          blue: i % 16 === 0
        });
      }
    }

    function frame(now) {
      if (!running) return;
      now = now || 0;
      if (now - last < STEP) { requestAnimationFrame(frame); return; }
      last = now;
      ctx.clearRect(0, 0, W, H);
      var m = 8;
      for (var i = 0; i < N; i++) {
        var n = nodes[i];
        var mv = reducedOS ? 0.35 : 1;
        n.x += n.vx * mv; n.y += n.vy * mv;
        if (n.x < m || n.x > W - m) n.vx *= -1;
        if (n.y < m || n.y > H - m) n.vy *= -1;
        /* o cursor desloca o que está perto; o sistema volta sozinho */
        var dxm = (n.x + n.ox) - mx, dym = (n.y + n.oy) - my;
        var dm = Math.sqrt(dxm * dxm + dym * dym);
        if (dm < CURSOR_LINK && dm > 0.5) {
          var f = (1 - dm / CURSOR_LINK) * 2.2 * mv;
          n.ox += dxm / dm * f;
          n.oy += dym / dm * f;
        }
        n.ox *= 0.88; n.oy *= 0.88;
        n.dx = n.x + n.ox; n.dy = n.y + n.oy;
      }
      for (var a = 0; a < N; a++) {
        for (var b = a + 1; b < N; b++) {
          var dx = nodes[a].dx - nodes[b].dx;
          var dy = nodes[a].dy - nodes[b].dy;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK) {
            ctx.strokeStyle = 'rgba(' + COR_LINHA + ',' + (A_LINHA * (1 - d / LINK)).toFixed(3) + ')';
            ctx.beginPath();
            ctx.moveTo(nodes[a].dx, nodes[a].dy);
            ctx.lineTo(nodes[b].dx, nodes[b].dy);
            ctx.stroke();
          }
        }
      }
      for (var c = 0; c < N; c++) {
        var dxc = nodes[c].dx - mx, dyc = nodes[c].dy - my;
        var dc = Math.sqrt(dxc * dxc + dyc * dyc);
        if (dc < CURSOR_LINK) {
          ctx.strokeStyle = 'rgba(125,151,255,' + (0.30 * (1 - dc / CURSOR_LINK)).toFixed(3) + ')';
          ctx.beginPath();
          ctx.moveTo(nodes[c].dx, nodes[c].dy);
          ctx.lineTo(mx, my);
          ctx.stroke();
        }
      }
      for (var k = 0; k < N; k++) {
        var nk = nodes[k];
        ctx.beginPath();
        ctx.arc(nk.dx, nk.dy, nk.r, 0, Math.PI * 2);
        ctx.fillStyle = nk.blue ? 'rgba(61,99,230,0.75)' : 'rgba(' + COR_NO + ',' + A_NO + ')';
        ctx.fill();
      }
      requestAnimationFrame(frame);
    }

    (sec || cv.parentElement).addEventListener('mousemove', function (e) {
      var r = cv.getBoundingClientRect();
      mx = e.clientX - r.left; my = e.clientY - r.top;
    });
    (sec || cv.parentElement).addEventListener('mouseleave', function () { mx = -1e4; my = -1e4; });

    var io = new IntersectionObserver(function (en) {
      var vis = en[0].isIntersecting;
      if (vis && !running) { running = true; last = 0; requestAnimationFrame(frame); }
      else if (!vis) running = false;
    });
    io.observe(cv);
    layout();
    window.addEventListener('resize', layout);
  }

  /* ============================================================
     9 · OVERLAY DO ESTUDO DE CASO
     ============================================================ */
  (function cases() {
    var overlay = $('#overlay');
    if (!overlay) return;
    var scrollBox = $('#overlay-scroll');
    var progress = $('#overlay-progress i');
    var secLabel = $('#overlay-section-label');
    var caseLabel = $('#overlay-case-label');
    var order = $$('.case-card').map(function (c) { return c.getAttribute('data-case'); });
    var current = null;
    var savedY = 0;
    var secIO = null;

    function build(id) {
      var tpl = $('#case-' + id);
      if (!tpl) return false;
      scrollBox.innerHTML = '';
      scrollBox.appendChild(tpl.content.cloneNode(true));
      var art = $('.case-article', scrollBox);

      /* foto de capa do estudo (opt-in): assets/img/cases/<id>.jpg */
      var hero = new Image();
      hero.className = 'case-hero-photo';
      hero.alt = '';
      hero.onload = function () { if (art) art.insertBefore(hero, art.firstChild); };
      hero.src = 'assets/img/cases/' + id + '.jpg';


      if (caseLabel) {
        var card = $('.case-card[data-case="' + id + '"] .case-title');
        caseLabel.textContent = card ? card.textContent : '';
      }

      if (secIO) secIO.disconnect();
      var hs = $$('.case-article h2', scrollBox);
      if ('IntersectionObserver' in window && hs.length) {
        secIO = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting && secLabel) secLabel.textContent = en.target.getAttribute('data-sec') || '';
          });
        }, { root: scrollBox, rootMargin: '-10% 0px -78% 0px' });
        hs.forEach(function (h) { secIO.observe(h); });
      }
      return true;
    }

    function open(id, keepOpen) {
      if (!build(id)) return;
      current = id;
      if (!keepOpen) {
        savedY = window.scrollY;
        overlay.classList.add('open');
        document.documentElement.classList.add('lock');
        document.body.classList.add('lock');
      }
      scrollBox.scrollTop = 0;
      if (progress) progress.style.width = '0%';
      if (secLabel) secLabel.textContent = 'resumo';
      try { history.replaceState(null, '', '#estudo-' + id); } catch (err) {}
    }

    function close() {
      overlay.classList.remove('open');
      document.documentElement.classList.remove('lock');
      document.body.classList.remove('lock');
      current = null;
      try { history.replaceState(null, '', location.pathname + location.search); } catch (err) {}
      window.scrollTo(0, savedY);
    }

    $$('.case-card').forEach(function (card) {
      card.addEventListener('click', function () { open(card.getAttribute('data-case')); });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(card.getAttribute('data-case')); }
      });
    });
    var btnClose = $('#overlay-close');
    if (btnClose) btnClose.addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && current) close(); });

    scrollBox.addEventListener('scroll', function () {
      var max = scrollBox.scrollHeight - scrollBox.clientHeight;
      if (progress) progress.style.width = (max > 0 ? scrollBox.scrollTop / max * 100 : 0) + '%';
    }, { passive: true });

    if (location.hash.indexOf('#estudo-') === 0) {
      var id0 = location.hash.replace('#estudo-', '');
      setTimeout(function () { open(id0); }, 600);
    }
  })();

  /* ============================================================
     10 · MIÚDOS
     ============================================================ */
  var toTop = $('#to-top');
  if (toTop) toTop.addEventListener('click', function (e) { e.preventDefault(); window.scrollTo({ top: 0, behavior: reducedOS ? 'auto' : 'smooth' }); });

  var portrait = $('.portrait img');
  if (portrait) {
    portrait.addEventListener('error', function () { portrait.closest('.portrait').classList.add('no-photo'); });
    if (portrait.complete && portrait.naturalWidth === 0) portrait.closest('.portrait').classList.add('no-photo');
  }

  runLoader();
})();


  /* ============================================================
     Filtro de temas dos estudos: cada botao mostra so a sua
     categoria; Todos devolve a grade inteira.
     ============================================================ */
  (function filtroCasos() {
    var bts = document.querySelectorAll('.cf-btn');
    if (!bts.length) return;
    function aplica(f) {
      document.querySelectorAll('.case-card').forEach(function (c) {
        var ok = f === 'todos' || c.getAttribute('data-cat') === f;
        c.classList.toggle('oculto', !ok);
      });
    }
    bts.forEach(function (b) {
      b.addEventListener('click', function () {
        bts.forEach(function (x) { x.classList.toggle('on', x === b); });
        aplica(b.getAttribute('data-f'));
      });
    });
    var on = document.querySelector('.cf-btn.on');
    if (on) aplica(on.getAttribute('data-f'));
  })();
