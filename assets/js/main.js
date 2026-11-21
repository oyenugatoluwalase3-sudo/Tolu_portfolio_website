/* ================================================================
   OYENUGA TOLUWALASE — PORTFOLIO JAVASCRIPT  (assets/js/main.js)
   Project data lives in assets/js/projects.js (loaded first).
   This file only renders and wires up interactions.
   ================================================================ */

const PAGE_SIZE = 9;                                   // cards per "page"
const FILTERS   = ["All", "Challenge", "Power BI", "SQL", "Python"];
const state     = { filter: "All", visible: PAGE_SIZE };

/* ── Helpers ─────────────────────────────────────────────────── */
function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

const isChallengeDay = (p) =>
  typeof CHALLENGE !== "undefined" && p.series === CHALLENGE.name;

/* ── Project cards ───────────────────────────────────────────── */
function buildPlaceholder(project) {
  const ph = el("div", "card__placeholder");

  if (project.series) {
    ph.appendChild(el("span", "placeholder-big", project.id));
    ph.appendChild(el("span", "placeholder-label", project.series));
  } else {
    const icon = el("div", "placeholder-icon");
    for (let i = 0; i < 5; i++) icon.appendChild(el("span"));
    ph.appendChild(icon);
    ph.appendChild(el("span", "placeholder-label", `${project.tool} · ${project.status}`));
  }
  return ph;
}

function buildCardImage(project) {
  const wrap = el("div", "card__img-wrap");

  if (!project.imageSrc) {
    wrap.appendChild(buildPlaceholder(project));
    return wrap;
  }

  const img = document.createElement("img");
  img.className = "card__img";
  img.src       = project.imageSrc;
  img.alt       = project.title;
  img.loading   = "lazy";
  img.addEventListener("load", () => img.classList.add("is-loaded"));
  // Missing/broken file -> show the placeholder instead of a broken icon
  img.addEventListener("error", () => wrap.replaceChildren(buildPlaceholder(project)));

  wrap.appendChild(img);
  wrap.appendChild(el("div", "card__img-sweep"));
  return wrap;
}

const GITHUB_SVG = `<svg viewBox="0 0 16 16" fill="currentColor" width="13" height="13" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>`;
const EXT_SVG    = `<svg class="card__cta-ext" viewBox="0 0 10 10" fill="none" width="10" height="10" aria-hidden="true"><path d="M1.5 8.5l7-7M4 1.5h5v5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

function buildCard(project, index) {
  const done = project.status === "Completed";
  const article = el("article", `project-card${done ? "" : " project-card--coming"}`);
  article.setAttribute("role", "listitem");
  article.setAttribute("aria-label", `Project: ${project.title}`);
  article.style.animationDelay = `${index * 90}ms`;

  article.appendChild(buildCardImage(project));

  const body = el("div", "card__body");

  // Header: id · tool + status badge
  const header = el("div", "card__header");
  header.appendChild(el("span", "card__number", `${project.id} · ${project.tool}`));
  header.appendChild(el("span", `card__badge ${done ? "card__badge--done" : "card__badge--soon"}`, project.status));
  body.appendChild(header);

  body.appendChild(el("h3", "card__title", project.title));
  body.appendChild(el("p", "card__desc", project.description));

  if (project.tags && project.tags.length) {
    const tags = el("div", "card__tags");
    project.tags.forEach((t) => tags.appendChild(el("span", done ? "card__tag" : "card__tag card__tag--muted", t)));
    body.appendChild(tags);
  }

  if (project.findings && project.findings.length) {
    body.appendChild(el("div", "card__divider"));
    body.appendChild(el("p", "card__findings-label", project.findingsLabel || "Key Findings"));
    const list = el("div", "card__findings");
    project.findings.forEach((f) => list.appendChild(el("span", done ? "card__finding" : "card__finding card__finding--muted", f)));
    body.appendChild(list);
  }

  // CTA
  if (done && project.githubLink) {
    const cta = document.createElement("a");
    cta.className = "card__cta";
    cta.href      = project.githubLink;
    cta.target    = "_blank";
    cta.rel       = "noopener noreferrer";
    cta.setAttribute("aria-label", `View ${project.title} on GitHub (opens in new tab)`);
    cta.innerHTML = `${GITHUB_SVG} View on GitHub ${EXT_SVG}`;
    body.appendChild(cta);
  } else if (!done) {
    body.appendChild(el("span", "card__cta card__cta--disabled", "In Progress"));
  }

  article.appendChild(body);
  return article;
}

/* ── Filters + "show more" ───────────────────────────────────── */
function matchesFilter(p, f) {
  if (f === "All") return true;
  if (f === "Challenge") return isChallengeDay(p);
  const needle = f.toLowerCase();
  return (p.tags || []).some((t) => t.toLowerCase().includes(needle));
}

const getFiltered = () => portfolioProjects.filter((p) => matchesFilter(p, state.filter));

let cardObserver = null;
function observeNewCards(cards) {
  if (!("IntersectionObserver" in window)) {
    cards.forEach((c) => c.classList.add("is-visible"));
    return;
  }
  if (!cardObserver) {
    cardObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          cardObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
  }
  cards.forEach((c) => cardObserver.observe(c));
}

function renderProjects({ append = false } = {}) {
  const grid = document.getElementById("projects-grid");
  if (!grid) return;

  if (typeof portfolioProjects === "undefined") {
    grid.replaceChildren(el("p", "projects-empty", "Projects could not load. Check that assets/js/projects.js is uploaded."));
    return;
  }

  const list  = getFiltered();
  const start = append ? grid.querySelectorAll(".project-card").length : 0;
  if (!append) grid.replaceChildren();

  if (!list.length) {
    grid.appendChild(el("p", "projects-empty", "No projects in this category yet."));
  }

  const added = list.slice(start, state.visible).map((p, i) => {
    const card = buildCard(p, i);
    grid.appendChild(card);
    return card;
  });
  observeNewCards(added);
  updateMoreButton(list.length);
}

function renderFilters() {
  const bar = document.getElementById("projects-filters");
  if (!bar || typeof portfolioProjects === "undefined") return;
  bar.replaceChildren();

  FILTERS.forEach((f) => {
    const count = portfolioProjects.filter((p) => matchesFilter(p, f)).length;
    if (!count) return;                                  // hide empty categories

    const btn = el("button", "filter-chip", f);
    btn.type = "button";
    btn.dataset.filter = f;
    btn.appendChild(el("span", "filter-chip__count", String(count)));
    btn.addEventListener("click", () => {
      state.filter  = f;
      state.visible = PAGE_SIZE;
      syncFilterButtons();
      renderProjects();
    });
    bar.appendChild(btn);
  });

  bar.hidden = bar.children.length <= 1;                 // only "All"? hide the bar
  syncFilterButtons();
}

function syncFilterButtons() {
  document.querySelectorAll(".filter-chip").forEach((b) => {
    const on = b.dataset.filter === state.filter;
    b.classList.toggle("is-active", on);
    b.setAttribute("aria-pressed", String(on));
  });
}

function updateMoreButton(total) {
  const wrap = document.getElementById("projects-more");
  const btn  = document.getElementById("projects-more-btn");
  if (!wrap || !btn) return;
  const remaining = total - state.visible;
  wrap.hidden = remaining <= 0;
  if (remaining > 0) btn.textContent = `Show ${Math.min(remaining, PAGE_SIZE)} more`;
}

function initMoreButton() {
  const btn = document.getElementById("projects-more-btn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    state.visible += PAGE_SIZE;
    renderProjects({ append: true });
  });
}

/* ── Challenge progress bar + hero stats (both read projects.js) ── */
function challengeDaysDone() {
  if (typeof portfolioProjects === "undefined") return 0;
  return portfolioProjects.filter((p) => isChallengeDay(p) && p.status === "Completed").length;
}

function renderChallengeProgress() {
  const box  = document.getElementById("challenge-progress");
  const done = challengeDaysDone();
  if (!box || !done) return;

  const pct = Math.min(100, Math.round((done / CHALLENGE.totalDays) * 100));
  box.innerHTML = `
    <div class="challenge-progress__top">
      <span class="challenge-progress__title"></span>
      <span class="challenge-progress__count"></span>
    </div>
    <div class="challenge-progress__bar" role="progressbar" aria-label="Challenge progress"
         aria-valuemin="0" aria-valuemax="${CHALLENGE.totalDays}" aria-valuenow="${done}">
      <span></span>
    </div>
    <a class="challenge-progress__link" target="_blank" rel="noopener noreferrer">Follow the full challenge on GitHub &rarr;</a>`;
  box.querySelector(".challenge-progress__title").textContent = CHALLENGE.name;
  box.querySelector(".challenge-progress__count").textContent = `Day ${done} of ${CHALLENGE.totalDays}`;
  box.querySelector(".challenge-progress__link").href = CHALLENGE.repo;
  box.hidden = false;

  const fill = box.querySelector(".challenge-progress__bar span");
  requestAnimationFrame(() => requestAnimationFrame(() => { fill.style.width = `${pct}%`; }));
}

function syncHeroStats() {
  if (typeof portfolioProjects === "undefined") return;
  const values = {
    completed: portfolioProjects.filter((p) => p.status === "Completed").length,
    challenge: challengeDaysDone()
  };
  document.querySelectorAll("[data-stat]").forEach((node) => {
    const v = values[node.dataset.stat];
    if (v !== undefined) {
      node.dataset.target = String(v);
      node.textContent    = String(v);
    }
  });
}

function initStatCounters() {
  const nums = document.querySelectorAll(".hero__stat-number span[data-target]");
  const bar  = document.querySelector(".hero__stats");
  if (!nums.length || !bar) return;

  const targets = Array.from(nums).map((n) => parseInt(n.dataset.target, 10) || 0);

  function countTo(node, target, duration) {
    const t0 = performance.now();
    (function step(now) {
      const p = Math.min((now - t0) / duration, 1);
      node.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }
  const run = () => nums.forEach((n, i) => countTo(n, targets[i], 1200));

  if (!("IntersectionObserver" in window)) return;       // static numbers stay
  new IntersectionObserver((entries, obs) => {
    if (entries.some((e) => e.isIntersecting)) { run(); obs.disconnect(); }
  }, { threshold: 0.5 }).observe(bar);
}

/* ── Contact section reveal ──────────────────────────────────── */
function observeContact() {
  const targets = document.querySelectorAll(".contact__header, .contact__form, .contact__links, .contact__open");
  if (!("IntersectionObserver" in window)) {
    targets.forEach((t) => t.classList.add("is-visible"));
    return;
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("is-visible"); obs.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  targets.forEach((t) => obs.observe(t));
}

/* ── Lazy image fade-in ──────────────────────────────────────── */
function initLazyImages() {
  document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
    if (img.complete) img.classList.add("is-loaded");
    else {
      img.addEventListener("load",  () => img.classList.add("is-loaded"));
      img.addEventListener("error", () => img.classList.add("is-loaded"));
    }
  });
}

/* ── Navigation ──────────────────────────────────────────────── */
function initNav() {
  const nav       = document.getElementById("main-nav");
  const hamburger = document.getElementById("hamburger");
  const drawer    = document.getElementById("nav-drawer");
  if (!nav) return;

  window.addEventListener("scroll", () => nav.classList.toggle("scrolled", window.scrollY > 40), { passive: true });
  if (!hamburger || !drawer) return;

  const mq = window.matchMedia("(max-width: 700px)");

  // Drawer is only "hidden" on mobile while closed. On desktop it is the
  // normal nav, so it must stay visible to screen readers and keyboards.
  function syncDrawer() {
    const hidden = mq.matches && !drawer.classList.contains("is-open");
    drawer.inert = hidden;
    if (hidden) drawer.setAttribute("aria-hidden", "true");
    else drawer.removeAttribute("aria-hidden");
  }
  function setOpen(open) {
    drawer.classList.toggle("is-open", open);
    hamburger.classList.toggle("is-open", open);
    hamburger.setAttribute("aria-expanded", String(open));
    syncDrawer();
  }

  hamburger.addEventListener("click", () => setOpen(!drawer.classList.contains("is-open")));
  drawer.querySelectorAll(".nav__link").forEach((l) => l.addEventListener("click", () => setOpen(false)));
  document.addEventListener("click", (e) => {
    if (drawer.classList.contains("is-open") && !drawer.contains(e.target) && !hamburger.contains(e.target)) setOpen(false);
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
  mq.addEventListener("change", () => setOpen(false));
  syncDrawer();
}

function initScrollSpy() {
  const links    = document.querySelectorAll(".nav__link[href^='#']");
  const sections = Array.from(links).map((l) => document.getElementById(l.getAttribute("href").slice(1))).filter(Boolean);
  if (!sections.length || !("IntersectionObserver" in window)) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((l) => l.classList.toggle("nav__link--active", l.getAttribute("href") === `#${entry.target.id}`));
    });
  }, { rootMargin: "-40% 0px -55% 0px", threshold: 0 });
  sections.forEach((s) => obs.observe(s));
}

/* ── Theme ───────────────────────────────────────────────────── */
function initTheme() {
  const html = document.documentElement;
  const btn  = document.getElementById("theme-toggle");

  let saved = "dark";
  try { saved = localStorage.getItem("portfolio-theme") || "dark"; } catch (e) { /* private mode */ }
  if (saved !== "light" && saved !== "dark") saved = "dark";
  html.setAttribute("data-theme", saved);
  if (!btn) return;

  const label = (t) => btn.setAttribute("aria-label", t === "dark" ? "Switch to light mode" : "Switch to dark mode");
  label(saved);

  btn.addEventListener("click", () => {
    const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    try { localStorage.setItem("portfolio-theme", next); } catch (e) { /* ignore */ }
    label(next);
  });
}

function initFooterYear() {
  const y = document.getElementById("footer-year");
  if (y) y.textContent = new Date().getFullYear();
}

/* ── Contact form ────────────────────────────────────────────── */
function initForm() {
  const form = document.querySelector(".contact__form");
  if (!form) return;

  // Send visitors back to whatever address the site is on right now, so the
  // form keeps working if you move to a new domain. (Skipped for file://.)
  if (location.protocol.startsWith("http")) {
    const next = document.createElement("input");
    next.type  = "hidden";
    next.name  = "_next";
    next.value = `${location.origin}${location.pathname}?sent=1`;
    form.appendChild(next);
  }

  const submitBtn  = form.querySelector('button[type="submit"]');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener("submit", (e) => {
    let firstBad = null;
    ["name", "email", "message"].forEach((n) => {
      const f = form.querySelector(`[name="${n}"]`);
      if (!f) return;
      const v   = f.value.trim();
      const bad = !v || (n === "email" && !emailRegex.test(v));
      f.style.borderColor = bad ? "#e24b4a" : "";
      f.setAttribute("aria-invalid", String(bad));
      if (bad && !firstBad) firstBad = f;
    });

    if (firstBad) { e.preventDefault(); firstBad.focus(); return; }

    if (submitBtn) {                                     // stop double-sends
      submitBtn.disabled = true;
      submitBtn.firstChild.textContent = "Sending… ";
    }
  });

  form.querySelectorAll(".form-input").forEach((i) =>
    i.addEventListener("input", () => { i.style.borderColor = ""; i.removeAttribute("aria-invalid"); })
  );

  // Back button (bfcache) can leave the button stuck on "Sending…"
  window.addEventListener("pageshow", (ev) => {
    if (ev.persisted && submitBtn) {
      submitBtn.disabled = false;
      submitBtn.firstChild.textContent = "Send Message ";
    }
  });
}

function checkFormRedirect() {
  if (new URLSearchParams(window.location.search).get("sent") !== "1") return;

  const form = document.querySelector(".contact__form");
  if (form) {
    const ok = el("div", "contact__success", "✓  Message received. I’ll get back to you soon.");
    ok.setAttribute("role", "status");
    form.replaceWith(ok);
    ok.classList.add("is-visible");
  }
  window.history.replaceState({}, "", window.location.pathname);
  const contact = document.getElementById("contact");
  if (contact) contact.scrollIntoView({ behavior: "smooth" });
}

/* ── Resume button: hide it if resume.pdf isn't uploaded (404) ── */
function initResumeLink() {
  const link = document.getElementById("resume-link");
  if (!link || !location.protocol.startsWith("http")) return;
  fetch(link.getAttribute("href"), { method: "HEAD" })
    .then((r) => { if (r.status === 404) link.hidden = true; })
    .catch(() => { /* offline: leave the button alone */ });
}

/* ── Boot ────────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initFooterYear();
  initNav();
  initScrollSpy();

  renderChallengeProgress();
  renderFilters();
  renderProjects();
  initMoreButton();

  syncHeroStats();
  initStatCounters();
  observeContact();
  initLazyImages();
  initForm();
  checkFormRedirect();
  initResumeLink();
});
