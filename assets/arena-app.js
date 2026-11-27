/* BUFF GALLERY — 목록 · 전시실 · 사진 보기 (3D는 전시실에 들어갈 때만 불러옴) */
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var MOBILE = matchMedia('(pointer:coarse)').matches;
  var REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

  var SPORT = { basketball: '농구', tabletennis: '탁구', lacrosse: '라크로스', baseball: '야구', football: '축구', futsal: '풋살', flagfootball: '플래그풋볼', rugby: '럭비', other: '기타' };
  var SPORT_EN = { basketball: 'BASKETBALL', tabletennis: 'TABLE TENNIS', lacrosse: 'LACROSSE', baseball: 'BASEBALL', football: 'FOOTBALL', futsal: 'FUTSAL', flagfootball: 'FLAG FOOTBALL', rugby: 'RUGBY', other: 'SPORTS' };
  /* 프로젝트별 전시실(현장 구조 기준). 없으면 종목 기본값 → 기본 전시실 */
  var ROOMS = {
    'aubl-yonsei-vs-tsinghua': { scene: 'arena-sangnoksu', scoreboard: 'tsinghua' }, // 안산 상록수체육관
    'aubl-yonsei-vs-sjtu': { scene: 'arena-sangnoksu', scoreboard: 'screen' },
    'ilc-pro-table-tennis-league-2026-series4': 'tt-hall',
    'lacrosse-seoul-open-2026': 'field-lacrosse'
  };
  var BY_SPORT = { basketball: 'arena-basketball', tabletennis: 'tt-hall', lacrosse: 'field-lacrosse' };

  var data = null, filter = 'all', proj = null, ctl = null, lbIndex = -1, lastFocus = null, cameFromList = false;

  /* ───────── 데이터 ───────── */
  function load() {
    if (!window.sbGet) return Promise.reject(new Error('config'));
    return Promise.all([
      window.sbGet('works', 'select=title,slug,category,categories,sports,client,work_year,thumbnail_url,images&published=eq.true&order=sort_order.asc'),
      window.sbGet('team_members', 'select=avatar_url,photo_url').catch(function () { return []; })
    ]).then(function (res) {
      var people = {};
      res[1].forEach(function (t) { if (t.avatar_url) people[t.avatar_url] = 1; if (t.photo_url) people[t.photo_url] = 1; });
      data = res[0].filter(function (r) { return r.category === 'photo' || (r.categories || []).indexOf('photo') >= 0; }).map(function (r) {
        var seen = {}, photos = [];
        [r.thumbnail_url].concat(r.images || []).forEach(function (u) {
          if (!u || seen[u] || people[u] || /\.(mp4|mov|webm)(\?|$)/i.test(u)) return;
          seen[u] = 1; photos.push({ i: photos.length, src: u });
        });
        var sport = (r.sports && r.sports[0]) || 'other';
        var room = ROOMS[r.slug]; if (typeof room === 'string') room = { scene: room };
        return { slug: r.slug, title: r.title, client: r.client, year: r.work_year, sport: sport, photos: photos, scene: (room && room.scene) || BY_SPORT[sport] || 'gallery', opts: room || {} };
      }).filter(function (p) { return p.photos.length; });
      return data;
    });
  }

  /* ───────── 목록 ───────── */
  function renderFilters() {
    var sports = [];
    data.forEach(function (p) { if (sports.indexOf(p.sport) < 0) sports.push(p.sport); });
    var nav = $('#filters'); nav.innerHTML = '';
    [['all', '전체']].concat(sports.map(function (s) { return [s, SPORT[s] || s]; })).forEach(function (f) {
      var b = document.createElement('button');
      b.textContent = f[1]; b.dataset.f = f[0]; b.setAttribute('aria-pressed', String(filter === f[0]));
      b.onclick = function () { filter = f[0]; history.replaceState(history.state, '', listUrl()); renderFilters(); renderCards(); };
      nav.appendChild(b);
    });
  }
  function renderCards() {
    var ul = $('#cards'); ul.innerHTML = '';
    data.filter(function (p) { return filter === 'all' || p.sport === filter; }).forEach(function (p) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.className = 'card'; a.href = '?p=' + encodeURIComponent(p.slug);
      a.innerHTML = '<div class="ph"><img loading="lazy" alt=""></div><div class="tx"><span class="sp"></span><h2></h2><p class="meta"></p><span class="go">전시실 입장 →</span></div>';
      a.querySelector('img').src = p.photos[0].src;
      a.querySelector('img').alt = p.title + ' 대표 사진';
      a.querySelector('.sp').textContent = (SPORT_EN[p.sport] || 'SPORTS') + ' · ' + (SPORT[p.sport] || '');
      a.querySelector('h2').textContent = p.title;
      a.querySelector('.meta').textContent = [p.client, p.year, '사진 ' + p.photos.length + '장'].filter(Boolean).join(' · ');
      a.onclick = function (e) { if (e.metaKey || e.ctrlKey || e.shiftKey) return; e.preventDefault(); saveListScroll(); cameFromList = true; history.pushState({ v: 'room' }, '', roomUrl(p.slug)); route(); };
      li.appendChild(a); ul.appendChild(li);
    });
  }
  function listUrl() { return location.pathname + (filter !== 'all' ? '?sport=' + filter : ''); }
  function roomUrl(slug, photo) { return location.pathname + '?p=' + encodeURIComponent(slug) + (photo != null ? '&photo=' + (photo + 1) : ''); }
  function saveListScroll() { try { sessionStorage.setItem('buffGalleryScroll', String(scrollY)); } catch (e) {} }
  function showList() {
    closeRoom();
    $('#list').hidden = false; $('.top').hidden = false;
    document.title = 'BUFF GALLERY';
    var q = new URLSearchParams(location.search);
    filter = q.get('sport') || 'all';
    if (data) { renderFilters(); renderCards(); }
    var y = 0; try { y = +sessionStorage.getItem('buffGalleryScroll') || 0; } catch (e) {}
    requestAnimationFrame(function () { scrollTo(0, y); });
  }

  /* ───────── 전시실 ───────── */
  var arenaScript = null;
  function loadArena() {
    if (window.BuffArena) return Promise.resolve();
    if (!arenaScript) arenaScript = new Promise(function (res, rej) {
      var s = document.createElement('script'); s.src = '/assets/arena3d.js?v=sangnoksu-v7'; s.async = true;
      s.onload = function () { window.BuffArena ? res() : rej(new Error('arena')); };
      s.onerror = function () { arenaScript = null; rej(new Error('arena')); };
      document.head.appendChild(s);
    });
    return arenaScript;
  }
  function webglOK() {
    try { var c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl'))); } catch (e) { return false; }
  }
  function openRoom(p) {
    if (proj && proj.slug === p.slug && (ctl || !$('#rfall').hidden || !$('#rload').hidden)) return; // 이미 열려 있음
    closeRoom();
    proj = p;
    $('#list').hidden = true; $('.top').hidden = true; $('#room').hidden = false;
    document.title = p.title + ' — BUFF GALLERY';
    $('#rt').textContent = p.title;
    $('#rs').textContent = [SPORT_EN[p.sport], p.client, p.year].filter(Boolean).join(' · ');
    $('#rlt').textContent = p.title;
    $('#rload').style.backgroundImage = 'url("' + p.photos[0].src.replace(/"/g, '%22') + '")';
    $('#rload').hidden = false; $('#rfall').hidden = true; $('#rbar').hidden = true;
    $('#rlm').textContent = '전시실을 준비하고 있어요';
    var token = p;
    if (!webglOK()) return fallback('이 기기에서는 3D 전시실을 열 수 없어 사진 목록으로 보여드려요.');
    var timer = setTimeout(function () { if (proj === token && !ctl) $('#rlm').textContent = '연결이 느려 시간이 걸리고 있어요. 사진 목록으로 먼저 보셔도 돼요.'; }, 8000);
    var hard = setTimeout(function () { if (proj === token && !ctl) fallback('3D 전시실을 불러오지 못해 사진 목록으로 보여드려요.'); }, 25000);
    loadArena().then(function () {
      if (proj !== token) return;
      try {
        ctl = window.BuffArena.mount($('#stage'), {
          sceneId: p.scene, project: { slug: p.slug, title: p.title, client: p.client, year: p.year, scoreboard: p.opts.scoreboard },
          photos: p.photos.map(function (x) { return { i: x.i, src: x.src }; }),
          reducedMotion: REDUCED,
          onPhoto: function (i) { var c = $('#stage canvas'); if (c) { c.tabIndex = -1; c.setAttribute('aria-label', '3D 전시실'); c.focus({ preventScroll: true }); } openPhoto(i, true); },
          onView: function (i, name, n) { updateBar(i, name); },
          onExit: function () { toList(); },
          onReady: function () {
            clearTimeout(timer); clearTimeout(hard);
            if (proj !== token) return;
            $('#rload').hidden = true; $('#rbar').hidden = false; buildDots(); showHint(false);
            var ph = new URLSearchParams(location.search).get('photo');
            if (ph) { history.replaceState({ v: 'room' }, '', roomUrl(p.slug)); openPhoto(+ph - 1, true); }
          }
        });
      } catch (e) { clearTimeout(timer); clearTimeout(hard); console.error(e); ctl = null; fallback('3D 전시실을 열지 못해 사진 목록으로 보여드려요.'); }
    }).catch(function () { clearTimeout(timer); clearTimeout(hard); if (proj === token) fallback('3D 전시실을 불러오지 못해 사진 목록으로 보여드려요.'); });
  }
  function fallback(msg) {
    if (ctl) { try { ctl.dispose(); } catch (e) {} ctl = null; }
    $('#rload').hidden = true; $('#rbar').hidden = true;
    $('#rfall').hidden = false; $('#rfmsg').textContent = msg;
    fillGrid($('#rfgrid'));
    var ph = new URLSearchParams(location.search).get('photo');
    if (ph) { history.replaceState({ v: 'room' }, '', roomUrl(proj.slug)); openPhoto(+ph - 1, true); }
  }
  function closeRoom() {
    if (ctl) { try { ctl.dispose(); } catch (e) {} ctl = null; }
    proj = null; $('#room').hidden = true; $('#stage').innerHTML = '';
    closeSheet(true); hideLB();
  }
  function toList() {
    if (cameFromList && history.state && history.state.v === 'room') { history.back(); return; }
    cameFromList = false;
    history.pushState({ v: 'list' }, '', listUrl()); route();
  }
  function buildDots() {
    var d = $('#dots'); d.innerHTML = '';
    ctl.viewpoints.forEach(function (v, i) {
      var b = document.createElement('button');
      b.setAttribute('aria-label', (i + 1) + '. ' + v.name + (v.exit ? ' (프로젝트 목록으로)' : ''));
      b.title = v.name; if (v.exit) b.className = 'ex';
      b.onclick = function () { ctl.go(i); };
      d.appendChild(b);
    });
    updateBar(ctl.current(), ctl.viewpoints[ctl.current()].name);
  }
  function updateBar(i, name) {
    if (!ctl) return;
    var n = ctl.viewpoints.length;
    $('#vpname').textContent = name + '  ' + (i + 1) + '/' + n;
    [].forEach.call($('#dots').children, function (b, k) { b.setAttribute('aria-current', String(k === i)); });
    $('#vprev').disabled = i === 0;
    var nxt = ctl.viewpoints[i + 1];
    $('#vnext').setAttribute('aria-label', nxt ? '다음 관람 지점: ' + nxt.name : '마지막 관람 지점');
    $('#vnext').disabled = !nxt;
  }
  $('#vprev').onclick = function () { ctl && ctl.prev(); };
  $('#vnext').onclick = function () { ctl && ctl.next(); };
  $('#vhome').onclick = function () { ctl && ctl.home(); };
  $('#toList').onclick = toList;
  $('#rlphotos').onclick = function () { openSheet(); };
  $('#photosBtn').onclick = function () { openSheet(); };

  /* ───────── 사진 목록 · 확대 ───────── */
  function fillGrid(el) {
    el.innerHTML = '';
    proj.photos.forEach(function (ph) {
      var b = document.createElement('button');
      b.setAttribute('aria-label', '사진 ' + (ph.i + 1) + ' 크게 보기');
      b.innerHTML = '<img loading="lazy" alt=""><span></span>';
      b.querySelector('img').src = ph.src; b.querySelector('span').textContent = ph.i + 1;
      b.onclick = function () { openPhoto(ph.i, true); };
      el.appendChild(b);
    });
  }
  function openSheet() {
    if (!proj) return;
    lastFocus = document.activeElement;
    fillGrid($('#shgrid')); $('#sheet').hidden = false; $('#shClose').focus();
  }
  function closeSheet(silent) { if ($('#sheet').hidden) return; $('#sheet').hidden = true; if (!silent && lastFocus) lastFocus.focus(); }
  $('#shClose').onclick = function () { closeSheet(); };

  var lbFocus = null;
  function openPhoto(i, push) {
    if (!proj) return;
    i = Math.max(0, Math.min(proj.photos.length - 1, i));
    if ($('#lb').hidden) lbFocus = document.activeElement;
    lbIndex = i;
    var ph = proj.photos[i], img = $('#lbImg');
    img.removeAttribute('src'); img.src = ph.src; img.alt = proj.title + ' 사진 ' + (i + 1);
    $('#lbT').textContent = proj.title;
    $('#lbM').textContent = [proj.client, proj.year, (i + 1) + ' / ' + proj.photos.length].filter(Boolean).join(' · ');
    $('#lbWork').href = '/work?' + proj.slug;
    $('#lbPrev').disabled = i === 0; $('#lbNext').disabled = i === proj.photos.length - 1;
    var wasOpen = !$('#lb').hidden;
    $('#lb').hidden = false;
    if (push && !wasOpen) history.pushState({ v: 'photo' }, '', roomUrl(proj.slug, i));
    else history.replaceState(history.state, '', roomUrl(proj.slug, i));
    $('#lbClose').focus();
  }
  function hideLB() { if ($('#lb').hidden) return false; $('#lb').hidden = true; lbIndex = -1; return true; }
  function closeLB() {
    if ($('#lb').hidden) return;
    if (history.state && history.state.v === 'photo') { history.back(); return; }
    hideLB(); history.replaceState(history.state, '', roomUrl(proj.slug));
    if (lbFocus && document.contains(lbFocus)) lbFocus.focus();
  }
  $('#lbClose').onclick = closeLB;
  $('#lbPrev').onclick = function () { openPhoto(lbIndex - 1, false); };
  $('#lbNext').onclick = function () { openPhoto(lbIndex + 1, false); };
  $('#lb').addEventListener('click', function (e) { if (e.target.id === 'lb') closeLB(); });
  (function () { // 스와이프
    var sx = null, sy = 0;
    $('#lb').addEventListener('pointerdown', function (e) { sx = e.clientX; sy = e.clientY; });
    $('#lb').addEventListener('pointerup', function (e) {
      if (sx == null) return;
      var dx = e.clientX - sx, dy = e.clientY - sy; sx = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) openPhoto(lbIndex + (dx < 0 ? 1 : -1), false);
    });
  })();
  addEventListener('keydown', function (e) {
    if (!$('#help').hidden) { if (e.key === 'Escape') closeHelp(); return; }
    if (!$('#lb').hidden) {
      if (e.key === 'Escape') closeLB();
      else if (e.key === 'ArrowRight') openPhoto(lbIndex + 1, false);
      else if (e.key === 'ArrowLeft') openPhoto(lbIndex - 1, false);
      return;
    }
    if (!$('#sheet').hidden) { if (e.key === 'Escape') closeSheet(); return; }
    if (ctl && !$('#room').hidden && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) {
      if (e.key === 'ArrowRight' && document.activeElement === document.body) ctl.next();
      if (e.key === 'ArrowLeft' && document.activeElement === document.body) ctl.prev();
    }
  });

  /* ───────── 안내 ───────── */
  var HELP = MOBILE ? [
    ['둘러보기', '사진이 없는 곳을 한 손가락으로 드래그하세요.'],
    ['지점 이동', '바닥의 흰 원을 탭하거나 아래 ← → 버튼을 누르세요.'],
    ['사진 감상', '사진을 탭하면 크게 볼 수 있어요. 좌우로 밀어 넘기고, 닫기로 돌아와요.'],
    ['사진만 보기', '아래 ‘사진 목록’에서 전체 사진을 바로 열 수 있어요.']
  ] : [
    ['둘러보기', '빈 곳을 클릭한 채 드래그하세요.'],
    ['지점 이동', '바닥의 흰 원을 클릭하거나 아래 ← → 버튼을 누르세요.'],
    ['사진 감상', '사진을 클릭하면 크게 볼 수 있어요. 좌우 화살표로 넘기고, Esc로 닫아요.'],
    ['위치 찾기', '아래에 현재 지점이 표시되고, ‘처음 위치로’로 돌아갈 수 있어요.'],
    ['사진만 보기', '‘사진 목록’에서 전체 사진을 바로 열 수 있어요.']
  ];
  function showHint(force) {
    var key = 'buffArenaHint';
    try { if (!force && localStorage.getItem(key)) return; localStorage.setItem(key, '1'); } catch (e) {}
    var h = $('#hint');
    h.textContent = MOBILE ? '바닥의 흰 원을 탭해 이동하고, 사진을 탭하면 크게 볼 수 있어요.' : '바닥의 흰 원을 클릭해 이동하고, 드래그로 둘러보세요. 사진을 클릭하면 크게 볼 수 있어요.';
    h.classList.remove('off');
    var off = function () { h.classList.add('off'); $('#stage').removeEventListener('pointerdown', off); };
    setTimeout(off, 7000); $('#stage').addEventListener('pointerdown', off);
  }
  var helpFocus = null;
  $('#helpBtn').onclick = function () {
    helpFocus = document.activeElement;
    $('#hdl').innerHTML = '';
    HELP.forEach(function (r) { var dt = document.createElement('dt'), dd = document.createElement('dd'); dt.textContent = r[0]; dd.textContent = r[1]; $('#hdl').appendChild(dt); $('#hdl').appendChild(dd); });
    $('#help').hidden = false; $('#helpOk').focus();
  };
  function closeHelp() { $('#help').hidden = true; if (helpFocus) helpFocus.focus(); }
  $('#helpOk').onclick = closeHelp;
  $('#help').addEventListener('click', function (e) { if (e.target.id === 'help') closeHelp(); });

  /* ───────── 주소에 따라 화면 결정(뒤로 가기: 사진 → 전시실 → 목록) ───────── */
  function route() {
    var q = new URLSearchParams(location.search), slug = q.get('p');
    if (!data) return;
    if (!slug) { showList(); return; }
    var p = data.filter(function (x) { return x.slug === slug; })[0];
    if (!p) { history.replaceState({ v: 'list' }, '', location.pathname); showList(); return; }
    var ph = q.get('photo');
    if (proj && proj.slug === slug) {
      if (ph) openPhoto(+ph - 1, false);
      else if (hideLB() && lbFocus && document.contains(lbFocus)) lbFocus.focus();
      return;
    }
    openRoom(p);
  }
  addEventListener('popstate', route);

  function start() {
    $('#lstatus').hidden = true;
    load().then(function () {
      if (!data.length) { $('#cards').innerHTML = ''; $('#lstatus').hidden = false; $('#lstatus').textContent = '아직 공개된 사진 프로젝트가 없어요.'; return; }
      if (!history.state) {
        var q0 = new URLSearchParams(location.search);
        if (q0.get('p')) { // 공유 링크로 바로 들어와도 뒤로 가기 → 목록
          var here = location.href;
          history.replaceState({ v: 'list' }, '', location.pathname);
          history.pushState({ v: 'room' }, '', here); cameFromList = true;
        } else history.replaceState({ v: 'list' }, '', location.href);
      }
      route();
    }).catch(function () {
      $('#cards').innerHTML = '';
      var s = $('#lstatus'); s.hidden = false; s.textContent = '프로젝트를 불러오지 못했어요. 네트워크를 확인해 주세요.';
      var b = document.createElement('button'); b.textContent = '다시 시도'; b.onclick = start; s.appendChild(b);
    });
  }
  start();
})();

