/* Luna Tour — Китай за 10 дней. Логика страницы: карта, карточки, анимации. */
(function () {
  "use strict";
  const LANG = window.LANG === "kk" ? "kk" : "ru";
  const T = (LANG === "kk" && window.TOUR_KK) ? window.TOUR_KK : window.TOUR;
  const UI = LANG === "kk" ? {
    more: "Толығырақ →", moreAria: "толығырақ", andMore: (n) => `және тағы ${n} орын`, transfer: "Гуйлинь · ауысу",
    from: "✈ Алматы · Астана · Ташкенттен", home: "✈ үйге", past: "Топ жолда", pause: "Автокөрсетуді тоқтата тұру", play: "Автокөрсетуді жалғастыру"
  } : {
    more: "Подробнее →", moreAria: "подробнее", andMore: (n) => `и ещё ${n} места`, transfer: "Гуйлинь · пересадка",
    from: "✈ из Алматы · Астаны · Ташкента", home: "✈ домой", past: "Группа уже в пути", pause: "Пауза автопоказа", play: "Продолжить автопоказ"
  };
  const CITIES = window.MAP_CITIES;
  const PROVINCES = window.MAP_PROVINCES || [];
  const NS = "http://www.w3.org/2000/svg";
  const hasGsap = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const thumb = (name) => `Images/photos/thumbs/${name}.jpg`;
  const full = (name) => `Images/photos/${name}.jpg`;

  const ICONS = {
    plane: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>',
    train: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h2.23l2-2H14l2 2h2v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-3.58-4-8-4zM7.5 17a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm3.5-6H6V6h5v5zm5.5 6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm1.5-6h-5V6h5v5z"/></svg>',
    city: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M5 21V7l7-4v18M19 21V11l-7-4M9 9h.01M9 13h.01M9 17h.01"/></svg>',
    mountain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20l6-11 4 6 2-3 6 8H3z"/></svg>',
    river: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 7c3-2 5 2 8 0s5-2 8 0M3 12c3-2 5 2 8 0s5-2 8 0M3 17c3-2 5 2 8 0s5-2 8 0"/></svg>',
    arrive: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M6 9l6 6 6-6M4 21h16"/></svg>',
    leave: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21V9M6 15l6-6 6 6M4 3h16"/></svg>',
    transfer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17h14M4 11l1.5-5A2 2 0 0 1 7.4 4.5h9.2a2 2 0 0 1 1.9 1.5L20 11M3 11h18v6H3z"/><circle cx="7.5" cy="17.5" r="1.8"/><circle cx="16.5" cy="17.5" r="1.8"/></svg>',
    hotel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20V7M3 16h18v4M21 16v-4a3 3 0 0 0-3-3H10v7"/><circle cx="6.5" cy="10.5" r="1.8"/></svg>',
    guide: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.5"/><path d="M3 20a6 6 0 0 1 12 0M16 4h5v6h-3l-2 2v-2h0z"/></svg>',
    food: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3v8M9 3v8M6 11v10M9 11v10M7.5 3v5M18 3c-2 0-3 2-3 5v3h3v10M18 3v18"/></svg>',
    taxi: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6h6l1 3H8zM5 17h14M4 13l1.2-4h13.6L20 13v4H4z"/><circle cx="7.5" cy="17.5" r="1.6"/><circle cx="16.5" cy="17.5" r="1.6"/></svg>',
    ticket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9V6h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4zM13 6v12"/></svg>'
  };

  /* ---------------- NAV ---------------- */
  const nav = document.getElementById("nav");
  const burger = document.getElementById("burger");
  const onScrollNav = () => nav.classList.toggle("is-scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();
  burger.addEventListener("click", () => nav.classList.toggle("is-open"));
  nav.querySelectorAll(".nav__links a").forEach((a) => a.addEventListener("click", () => nav.classList.remove("is-open")));

  /* ---------------- STATS COUNTER ---------------- */
  const counters = document.querySelectorAll("[data-count]");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target; const target = +el.dataset.count; const t0 = performance.now();
      const tick = (now) => {
        const k = Math.min(1, (now - t0) / 1200); const eased = 1 - Math.pow(1 - k, 3);
        el.textContent = Math.round(target * eased);
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick); io.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach((c) => io.observe(c));

  /* ---------------- RENDER: CITIES ---------------- */
  const citiesList = document.getElementById("citiesList");
  T.stops.forEach((s, ci) => {
    const galleryCls = s.attractions.length === 4 ? "city__gallery cols-2" : "city__gallery";
    const art = document.createElement("article");
    art.className = "city rv"; art.id = `city-${s.id}`;
    art.innerHTML = `
      <div class="container">
        <div class="city__grid">
          <div class="city__media">
            <span class="city__bignum" aria-hidden="true">${s.num}</span>
            <img src="${s.hero}" alt="${s.name}" loading="lazy">
            <span class="city__cn" aria-hidden="true">${s.cn}</span>
          </div>
          <div class="city__text">
            <p class="label">${s.dates}</p>
            <h3 class="city__title">${s.name}</h3>
            <p class="city__tag">${s.tagline}</p>
            <p class="city__intro">${s.intro}</p>
            <ul class="city__meta">
              <li>${ICONS.arrive}<span>${s.arrive}</span></li>
              <li>${ICONS.leave}<span>${s.leave}</span></li>
            </ul>
          </div>
        </div>
        <div class="${galleryCls}">
          ${s.attractions.map((a, i) => `
            <figure class="spot" tabindex="0" role="button" data-city="${ci}" data-idx="${i}" aria-label="${a.name}: ${UI.moreAria}">
              <div class="spot__img"><img src="${thumb(a.img)}" alt="${a.name}" loading="lazy"></div>
              <figcaption class="spot__cap"><b>${a.name}</b><span>${UI.more}</span></figcaption>
            </figure>`).join("")}
        </div>
      </div>`;
    citiesList.appendChild(art);
  });

  /* ---------------- SPOT MODAL ---------------- */
  const modal = document.getElementById("spotModal");
  const md = { img: document.getElementById("mdImg"), city: document.getElementById("mdCity"), title: document.getElementById("mdTitle"), desc: document.getElementById("mdDesc"), count: document.getElementById("mdCount") };
  let mdCity = 0, mdIdx = 0, lastFocus = null;
  const showSpot = (ci, i) => {
    const s = T.stops[ci]; const n = s.attractions.length;
    mdCity = ci; mdIdx = (i + n) % n;
    const a = s.attractions[mdIdx];
    md.img.src = full(a.img); md.img.alt = a.name;
    md.city.textContent = `${s.name} · ${s.dates}`;
    md.title.textContent = a.name; md.desc.textContent = a.desc;
    md.count.textContent = `${mdIdx + 1} / ${n}`;
  };
  const openModal = (ci, i, trigger) => {
    lastFocus = trigger || document.activeElement;
    showSpot(ci, i);
    modal.classList.add("is-open"); modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    modal.querySelector(".modal__close").focus();
  };
  const closeModal = () => {
    modal.classList.remove("is-open"); modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };
  citiesList.addEventListener("click", (e) => {
    const fig = e.target.closest(".spot"); if (!fig) return;
    openModal(+fig.dataset.city, +fig.dataset.idx, fig);
  });
  citiesList.addEventListener("keydown", (e) => {
    const fig = e.target.closest(".spot"); if (!fig) return;
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(+fig.dataset.city, +fig.dataset.idx, fig); }
  });
  modal.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", closeModal));
  document.getElementById("mdPrev").addEventListener("click", () => showSpot(mdCity, mdIdx - 1));
  document.getElementById("mdNext").addEventListener("click", () => showSpot(mdCity, mdIdx + 1));
  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("is-open")) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowLeft") showSpot(mdCity, mdIdx - 1);
    if (e.key === "ArrowRight") showSpot(mdCity, mdIdx + 1);
  });

  /* ---------------- RENDER: PROGRAM ---------------- */
  const tl = document.getElementById("timeline");
  T.itinerary.forEach((d, i) => {
    const li = document.createElement("li");
    li.className = `day day--${d.icon} rv`; li.style.transitionDelay = `${(i % 3) * 0.08}s`;
    li.innerHTML = `<div class="day__date">${ICONS[d.icon] || ""}${d.date}</div><h3 class="day__title">${d.title}</h3><p class="day__text">${d.text}</p>`;
    tl.appendChild(li);
  });
  const plistItem = (x) => typeof x === "string" ? `<li><span>${x}</span></li>` : `<li><i class="plist__ico">${ICONS[x.icon] || ""}</i><span>${x.text}</span></li>`;
  document.getElementById("includedList").innerHTML = T.included.map(plistItem).join("");
  document.getElementById("notIncludedList").innerHTML = T.notIncluded.map(plistItem).join("");

  /* ---------------- COUNTDOWN + CONTACT CARD ---------------- */
  const cd = document.getElementById("countdown");
  if (cd) {
    const target = new Date("2026-10-24T00:00:00+05:00").getTime();
    const cells = { d: cd.querySelector('[data-cd="d"]'), h: cd.querySelector('[data-cd="h"]'), m: cd.querySelector('[data-cd="m"]') };
    const setCell = (el, v) => { const s = String(v).padStart(2, "0"); if (el.textContent !== s) { el.textContent = s; el.classList.remove("is-tick"); void el.offsetWidth; el.classList.add("is-tick"); } };
    const tickCd = () => {
      const diff = target - Date.now();
      if (diff <= 0) { cd.classList.add("is-past"); cd.querySelector(".countdown__title span").textContent = UI.past; return; }
      setCell(cells.d, Math.floor(diff / 864e5));
      setCell(cells.h, Math.floor(diff / 36e5) % 24);
      setCell(cells.m, Math.floor(diff / 6e4) % 60);
    };
    tickCd(); setInterval(tickCd, 15000);
  }
  const cardEl = document.getElementById("contactCard");
  if (cardEl && window.matchMedia("(hover: hover)").matches && !reduceMotion) {
    cardEl.addEventListener("mousemove", (e) => {
      const r = cardEl.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      cardEl.style.transform = `perspective(1000px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 9).toFixed(2)}deg) translateY(-4px)`;
    });
    cardEl.addEventListener("mouseleave", () => { cardEl.style.transform = ""; });
  }

  /* ---------------- REVEAL ON SCROLL ---------------- */
  document.querySelectorAll(".plist, .ticket, .program__head, .cities__head, .tips__head, .video__head, .video__item").forEach((el) => el.classList.add("rv"));
  document.querySelectorAll(".bento__card").forEach((el, i) => { el.style.transitionDelay = `${(i % 4) * 0.08}s`; });
  const rio = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); rio.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".rv").forEach((el) => rio.observe(el));

  /* ---------------- MAP ---------------- */
  const svg = document.getElementById("mapSvg");
  const gProv = document.getElementById("provinces");
  const gFlight = document.getElementById("flightPaths");
  const gRoute = document.getElementById("routePaths");
  const gMarkers = document.getElementById("markers");
  const gVehicle = document.getElementById("vehicle");
  const VISITED = new Set([500000, 430000, 450000, 440000]);

  const el = (tag, attrs, parent) => {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  };

  PROVINCES.forEach((p) => {
    el("path", { d: p.d, class: "prov" + (VISITED.has(p.adcode) ? " prov--visited" : ""), "data-name": p.name }, gProv);
  });

  // Route through the stops (Guilin as transfer point) — Catmull-Rom → cubic Bézier
  const stopKeys = ["chongqing", "furong", "zhangjiajie", "guilin", "yangshuo", "guangzhou"];
  const pts = stopKeys.map((k) => CITIES[k]);
  const smooth = (P, tension = 0.3) => {
    const dist = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
    // tangent at each point: direction prev→next, length limited by the shorter neighbouring segment
    const tang = P.map((p, i) => {
      const a = P[i - 1] || p, b = P[i + 1] || p;
      const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
      const m = Math.min(i > 0 ? dist(a, p) : Infinity, i < P.length - 1 ? dist(p, b) : Infinity) * tension;
      return [dx / L * m, dy / L * m];
    });
    let d = `M${P[0][0]} ${P[0][1]}`;
    for (let i = 0; i < P.length - 1; i++) {
      const p1 = P[i], p2 = P[i + 1], t1 = tang[i], t2 = tang[i + 1];
      d += ` C${(p1[0] + t1[0]).toFixed(1)} ${(p1[1] + t1[1]).toFixed(1)} ${(p2[0] - t2[0]).toFixed(1)} ${(p2[1] - t2[1]).toFixed(1)} ${p2[0]} ${p2[1]}`;
    }
    return d;
  };
  const routeD = smooth(pts);
  el("path", { d: routeD, class: "route-path-bg" }, gRoute);
  const routePath = el("path", { d: routeD, class: "route-path" }, gRoute);
  const routeLen = routePath.getTotalLength();
  routePath.style.strokeDasharray = routeLen;
  routePath.style.strokeDashoffset = routeLen;

  // Flight arcs: arrival from the north-west (Almaty / Astana / Tashkent), departure back from Guangzhou
  const cq = CITIES.chongqing, gz = CITIES.guangzhou;
  const inD = `M-80 -30 Q ${cq[0] - 260} ${cq[1] - 40} ${cq[0]} ${cq[1]}`;
  const outD = `M${gz[0]} ${gz[1]} Q ${gz[0] + 230} ${gz[1] - 300} ${gz[0] + 150} -60`;
  el("path", { d: inD, class: "flight-path-bg" }, gFlight);
  el("path", { d: outD, class: "flight-path-bg" }, gFlight);
  const flightIn = el("path", { d: inD, class: "flight-path" }, gFlight);
  const flightOut = el("path", { d: outD, class: "flight-path" }, gFlight);
  const inLen = flightIn.getTotalLength(), outLen = flightOut.getTotalLength();
  flightIn.style.strokeDasharray = `${inLen} ${inLen}`; flightIn.style.strokeDashoffset = inLen;
  flightOut.style.strokeDasharray = `${outLen} ${outLen}`; flightOut.style.strokeDashoffset = outLen;
  const originLbl = el("text", { x: 24, y: 78, class: "origin-label" }, gFlight);
  originLbl.textContent = UI.from;
  const homeLbl = el("text", { x: gz[0] + 95, y: 68, class: "origin-label" }, gFlight);
  homeLbl.textContent = UI.home;

  // Length along the route at each stop (nearest sample point)
  const SAMPLES = 1600;
  const sampled = [];
  for (let i = 0; i <= SAMPLES; i++) { const p = routePath.getPointAtLength((i / SAMPLES) * routeLen); sampled.push([p.x, p.y]); }
  const lenAt = (pt) => {
    let best = 0, bd = Infinity;
    sampled.forEach((s, i) => { const d = (s[0] - pt[0]) ** 2 + (s[1] - pt[1]) ** 2; if (d < bd) { bd = d; best = i; } });
    return (best / SAMPLES) * routeLen;
  };
  const stopLens = T.stops.map((s) => lenAt(CITIES[s.id]));

  // Markers
  const LABEL_POS = {
    chongqing: { dx: -14, dy: -18, anchor: "end" },
    furong: { dx: -12, dy: 34, anchor: "end" },
    zhangjiajie: { dx: 16, dy: -12, anchor: "start" },
    guilin: { dx: -12, dy: 4, anchor: "end" },
    yangshuo: { dx: 16, dy: 6, anchor: "start" },
    guangzhou: { dx: 18, dy: 28, anchor: "start" }
  };
  const markers = {};
  const makeMarker = (id, name, cn, transfer) => {
    const [x, y] = CITIES[id];
    const g = el("g", { class: "marker" + (transfer ? " marker--transfer" : ""), "data-id": id, transform: `translate(${x} ${y})` }, gMarkers);
    if (!transfer) el("circle", { r: 12, class: "marker__ring" }, g);
    el("circle", { r: transfer ? 4 : 7, class: "marker__dot" }, g);
    const lp = LABEL_POS[id];
    const t = el("text", { x: lp.dx, y: lp.dy, "text-anchor": lp.anchor, class: "marker__label" }, g);
    t.textContent = name;
    if (cn) { const c = el("text", { x: lp.dx, y: lp.dy + 15, "text-anchor": lp.anchor, class: "marker__cn" }, g); c.textContent = cn; }
    markers[id] = g;
    return g;
  };
  T.stops.forEach((s) => makeMarker(s.id, s.name, s.cn, false));
  makeMarker("guilin", UI.transfer, "", true);

  // Vehicle (plane / train)
  const veh = el("g", { class: "vehicle" }, gVehicle);
  const vehPlane = el("g", { transform: "translate(-13 -13) scale(1.1)" }, veh);
  vehPlane.innerHTML = '<circle cx="12" cy="12" r="13" fill="#061a35" stroke="#38d1d8" stroke-width="1.5"/><path fill="#38d1d8" transform="translate(12 12) rotate(90) translate(-12 -12)" d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>';
  const vehTrain = el("g", {}, veh);
  vehTrain.innerHTML = '<rect x="-20" y="-8" width="40" height="16" rx="8" fill="#f6b21b" stroke="#061a35" stroke-width="2"/><rect x="-14" y="-4" width="7" height="6" rx="1.5" fill="#061a35"/><rect x="-4" y="-4" width="7" height="6" rx="1.5" fill="#061a35"/><rect x="6" y="-4" width="7" height="6" rx="1.5" fill="#061a35"/><circle cx="17" cy="0" r="2" fill="#fff"/>';
  const showVehicle = (type) => { vehPlane.style.display = type === "plane" ? "" : "none"; vehTrain.style.display = type === "train" ? "" : "none"; veh.style.display = type ? "" : "none"; };
  const placeOn = (path, len, type) => {
    const p = path.getPointAtLength(len);
    const p2 = path.getPointAtLength(Math.min(path.getTotalLength(), len + 2));
    const p1 = path.getPointAtLength(Math.max(0, len - 2));
    let ang = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
    if (type === "train" && (ang > 90 || ang < -90)) ang += 180; // keep train upright
    veh.setAttribute("transform", `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${ang.toFixed(1)})`);
    showVehicle(type);
  };

  /* ---------------- STOP CARD ---------------- */
  const steps = document.getElementById("steps");
  const card = {
    inner: document.getElementById("stopcardInner"), photo: document.getElementById("scPhoto"), num: document.getElementById("scNum"), cn: document.getElementById("scCn"),
    name: document.getElementById("scName"), tag: document.getElementById("scTag"), dates: document.getElementById("scDates"), list: document.getElementById("scList"), more: document.getElementById("scMore")
  };
  T.stops.forEach((s, i) => {
    const b = document.createElement("button");
    b.className = "step"; b.type = "button"; b.dataset.index = i;
    b.innerHTML = `<b>${s.num}</b><span>${s.name}</span>`;
    steps.appendChild(b);
  });
  const stepEls = [...steps.children];
  let active = -1;
  const fillCard = (i) => {
    const s = T.stops[i];
    card.photo.src = s.hero; card.photo.alt = s.name;
    card.num.textContent = s.num; card.cn.textContent = s.cn; card.name.textContent = s.name;
    card.tag.textContent = s.tagline; card.dates.textContent = s.dates;
    const MAX = 6;
    const shown = s.attractions.length > MAX ? s.attractions.slice(0, MAX - 1) : s.attractions;
    card.list.innerHTML = shown.map((a) => `<li><img src="${thumb(a.img)}" alt=""><span>${a.name}</span></li>`).join("")
      + (s.attractions.length > MAX ? `<li class="is-more"><i>+${s.attractions.length - (MAX - 1)}</i><span>${UI.andMore(s.attractions.length - (MAX - 1))}</span></li>` : "");
    card.more.href = `#city-${s.id}`;
  };
  const setActive = (i, animate = true) => {
    if (i === active) return;
    active = i;
    if (hasGsap && animate && !reduceMotion) {
      gsap.to(card.inner, { opacity: 0, y: 18, duration: 0.22, ease: "power2.in", onComplete: () => { fillCard(i); gsap.fromTo(card.inner, { opacity: 0, y: -18 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }); } });
    } else fillCard(i);
    stepEls.forEach((b, k) => { b.classList.toggle("is-active", k === i); b.classList.toggle("is-visited", k < i); });
    T.stops.forEach((s, k) => { markers[s.id].classList.toggle("is-active", k === i); markers[s.id].classList.toggle("is-visited", k < i); });
  };

  /* ---------------- PROGRESS TIMELINE ---------------- */
  // Segments of the scroll progress [0..1]: flight in → (dwell → move)* → flight out
  const FLIGHT_IN = 0.09, FLIGHT_OUT = 0.07, DWELL = 0.075;
  const nStops = T.stops.length;
  const moveTotal = 1 - FLIGHT_IN - FLIGHT_OUT - DWELL * nStops;
  const segs = [];
  let t = 0;
  segs.push({ type: "flightIn", t0: 0, t1: FLIGHT_IN }); t = FLIGHT_IN;
  for (let i = 0; i < nStops; i++) {
    segs.push({ type: "dwell", stop: i, t0: t, t1: t + DWELL }); t += DWELL;
    if (i < nStops - 1) {
      const frac = (stopLens[i + 1] - stopLens[i]) / (stopLens[nStops - 1] - stopLens[0]);
      segs.push({ type: "move", from: i, t0: t, t1: t + moveTotal * frac, l0: stopLens[i], l1: stopLens[i + 1] }); t += moveTotal * frac;
    }
  }
  segs.push({ type: "flightOut", t0: t, t1: 1 });
  const dwellStart = (i) => segs.find((s) => s.type === "dwell" && s.stop === i).t0;

  const render = (p) => {
    p = Math.max(0, Math.min(1, p));
    const seg = segs.find((s) => p >= s.t0 && p <= s.t1) || segs[segs.length - 1];
    const k = (p - seg.t0) / (seg.t1 - seg.t0 || 1);
    let routeLenNow, act;
    if (seg.type === "flightIn") {
      flightIn.style.strokeDashoffset = inLen * (1 - k);
      routeLenNow = 0; act = 0;
      placeOn(flightIn, inLen * k, "plane");
    } else if (seg.type === "dwell") {
      flightIn.style.strokeDashoffset = 0;
      routeLenNow = stopLens[seg.stop] - stopLens[0]; act = seg.stop;
      placeOn(routePath, stopLens[seg.stop], "train");
      if (seg.stop === 0) showVehicle("plane"), placeOn(flightIn, inLen, "plane");
    } else if (seg.type === "move") {
      flightIn.style.strokeDashoffset = 0;
      const L = seg.l0 + (seg.l1 - seg.l0) * k;
      routeLenNow = L - stopLens[0]; act = seg.from;
      placeOn(routePath, L, "train");
    } else { // flightOut
      flightIn.style.strokeDashoffset = 0;
      routeLenNow = stopLens[nStops - 1] - stopLens[0]; act = nStops - 1;
      flightOut.style.strokeDashoffset = outLen * (1 - k);
      placeOn(flightOut, outLen * k, "plane");
    }
    if (seg.type !== "flightOut") flightOut.style.strokeDashoffset = outLen;
    routePath.style.strokeDashoffset = routeLen - Math.max(0, routeLenNow) - (seg.type === "dwell" || seg.type === "move" ? 0 : 0);
    // the route starts at Chongqing (stopLens[0] ≈ 0)
    setActive(act);
  };

  // Keep the card exactly as tall as the map (desktop) so switching stops never shifts the layout
  const mapEl = document.getElementById("map");
  const stopcardEl = document.getElementById("stopcard");
  const syncHeights = () => {
    if (window.innerWidth > 900) {
      stopcardEl.style.setProperty("--card-h", mapEl.offsetHeight + "px");
      stopcardEl.classList.add("is-synced");
    } else {
      stopcardEl.classList.remove("is-synced");
    }
  };
  syncHeights();
  window.addEventListener("resize", syncHeights);
  window.addEventListener("load", syncHeights);

  const playBtn = document.getElementById("mapPlay");
  if (hasGsap && !reduceMotion) {
    gsap.registerPlugin(ScrollTrigger);
    // Autoplay: the whole journey takes ~34 s and loops; clicking a stop jumps there and pauses the loop for a while
    const proxy = { p: 0 };
    const LOOP = 34;
    let userPaused = false, resumeCall = null, jump = null;
    const main = gsap.to(proxy, { p: 1, duration: LOOP, ease: "none", repeat: -1, repeatDelay: 2.5, paused: true, onUpdate: () => render(proxy.p) });
    const inView = { v: false };
    const setBtn = () => playBtn.setAttribute("data-state", userPaused ? "paused" : "playing");
    const tryPlay = () => { if (inView.v && !userPaused && !jump) main.play(); };
    ScrollTrigger.create({
      trigger: "#route", start: "top 75%", end: "bottom 25%",
      onEnter: () => { inView.v = true; tryPlay(); },
      onEnterBack: () => { inView.v = true; tryPlay(); },
      onLeave: () => { inView.v = false; main.pause(); },
      onLeaveBack: () => { inView.v = false; main.pause(); }
    });
    render(0);
    const goTo = (i) => {
      const target = dwellStart(i) + DWELL * 0.5;
      main.pause();
      if (resumeCall) resumeCall.kill();
      if (jump) jump.kill();
      jump = gsap.to(proxy, {
        p: target, duration: 0.9, ease: "power2.inOut",
        onUpdate: () => render(proxy.p),
        onComplete: () => {
          jump = null;
          resumeCall = gsap.delayedCall(6, () => { main.time(proxy.p * LOOP); tryPlay(); });
        }
      });
    };
    stepEls.forEach((b) => b.addEventListener("click", () => goTo(+b.dataset.index)));
    T.stops.forEach((s, i) => markers[s.id].addEventListener("click", () => goTo(i)));
    playBtn.addEventListener("click", () => {
      userPaused = !userPaused; setBtn();
      playBtn.setAttribute("aria-label", userPaused ? UI.play : UI.pause);
      if (userPaused) { main.pause(); if (resumeCall) resumeCall.kill(); }
      else { main.time(proxy.p * LOOP); tryPlay(); }
    });
    // Hero parallax
    gsap.to(".hero__content", { yPercent: 18, opacity: 0.2, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    window.addEventListener("load", () => ScrollTrigger.refresh());
  } else {
    // Fallback without GSAP: static map with everything drawn, steps switch the card
    flightIn.style.strokeDashoffset = 0; flightOut.style.strokeDashoffset = 0; routePath.style.strokeDashoffset = 0;
    showVehicle(null);
    setActive(0, false);
    stepEls.forEach((b) => b.addEventListener("click", () => setActive(+b.dataset.index, false)));
    T.stops.forEach((s, i) => markers[s.id].addEventListener("click", () => setActive(i, false)));
    document.querySelector(".route__hint").style.display = "none";
    playBtn.style.display = "none";
  }
})();
