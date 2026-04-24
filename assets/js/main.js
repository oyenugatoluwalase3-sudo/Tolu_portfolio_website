/* ================================================================
   OYENUGA TOLUWALASE — PORTFOLIO JAVASCRIPT
   Includes: project data array, DOM injection, all interactions
   ================================================================
 
   HOW TO ADD / EDIT PROJECTS
   ───────────────────────────
   1. Open this file.
   2. Find the `portfolioProjects` array below.
   3. To ADD a project: copy one of the existing objects, paste it
      at the end of the array (before the closing `]`), and fill
      in your details. Make sure you add a comma after the previous
      object.
   4. To EDIT a project: change the relevant field values.
   5. To REMOVE a project: delete the entire `{ … }` block.
   6. To mark a project DONE: change `status: "In Progress"` to
      `status: "Completed"` and add a real `githubLink`.
   7. Save the file and refresh your browser.
 
   FIELDS REFERENCE
   ────────────────
   id           — unique string, e.g. "01"
   tool         — primary tool name shown in card header, e.g. "Power BI"
   status       — "Completed"  |  "In Progress"
   title        — project title
   description  — 1–2 sentence description
   tags         — array of strings, shown as pills
   findingsLabel— label above the findings list (e.g. "Key Findings")
   findings     — array of strings, bullet points on the card
   githubLink   — full URL; use "" or "#" when not ready
   imageSrc     — relative path from index.html, e.g. "images/foo.png"
                  leave "" to show the animated placeholder
   ================================================================ */
 
/* ──────────────────────────────────────────────────────────────
   PROJECT DATA — EDIT THIS ARRAY TO MANAGE YOUR PORTFOLIO
   ────────────────────────────────────────────────────────────── */
const portfolioProjects = [
  {
    id: "01",
    tool: "Power BI",
    status: "Completed",
    title: "Chocolate Sales Dashboard",
    description: "End-to-end Power BI report analysing global chocolate sales.",
    tags: ["Power BI", "DAX", "Sales Analytics"],
    findingsLabel: "Key Findings",
    findings: [
      "$12.8M total revenue · 7.4% YoY growth",
      "Australia led all 6 markets at $2.4M"
    ],
    githubLink: "https://github.com/oyenugatoluwalase3-sudo/chocolate-sales-dashboard",
    imageSrc: "images/images__1_-removebg-preview.png"
  },
  {
    id: "02",
    tool: "Python",
    status: "Completed",
    title: "Nigerian Healthcare EDA",
    description: "An Exploratory Data Analysis project investigating disease burden, geographic hotspots, and healthcare infrastructure across Nigeria.",
    tags: ["Python", "Pandas", "Plotly", "EDA"],
    findingsLabel: "Key Insights",
    findings: [
      "Visualized geographic disease burden across 36 states using interactive Plotly maps.",
      "Tracked time-series trends (2015-2023) for highest-impact diseases dynamically.",
      "Utilized correlation matrices to mathematically prove the synthetic, unweighted nature of the facility dataset."
    ],
    githubLink: "https://github.com/oyenugatoluwalase3-sudo/nigerian-healthcare-eda",
    imageSrc: "images/map-screenshot.png"
  },
  {
    id: "03",
    tool: "SQL",
    status: "Completed",
    title: "Indian Flight Booking & Pricing Analysis",
    description: "An analytical SQL layer built on a 300,000+ record dataset to uncover airline pricing strategies, class premiums, and route volatility.",
    tags: ["SQL Server", "CTEs", "Window Functions", "Data Cleansing"],
    findingsLabel: "Business & Technical Highlights",
    findings: [
      "Calculated a 600% class premium gap, revealing Vistara's massive ~47K Rupee markup for Business class.",
      "Identified the Delhi-Mumbai corridor as the undisputed premium travel hub (>5,000 Business flights).",
      "Engineered multi-table JOINs and NTILE window functions to map exponential last-minute price hikes."
    ],
    githubLink: "https://github.com/oyenugatoluwalase3-sudo/Flight-Booking-SQL-Analysis",
    imageSrc: "images/flight-booking-screenshot.png" 
  }
];
 
/* ──────────────────────────────────────────────────────────────
   UTILITY HELPERS
   ────────────────────────────────────────────────────────────── */
 
/**
 * Create an element with optional class names and inner HTML.
 * @param {string} tag
 * @param {string} [cls]
 * @param {string} [html]
 * @returns {HTMLElement}
 */
function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
}
 
/* ──────────────────────────────────────────────────────────────
   BUILD PROJECT CARDS
   ────────────────────────────────────────────────────────────── */
 
/**
 * Build the image section of a card.
 * Returns a filled img element or an animated placeholder.
 */
function buildCardImage(project) {
  const wrap = el("div", "card__img-wrap");
 
  if (project.imageSrc) {
    const img = document.createElement("img");
    img.className    = "card__img";
    img.src          = project.imageSrc;
    img.alt          = project.title;
    img.loading      = "lazy";
 
    // Trigger fade-in once loaded
    img.addEventListener("load",  () => img.classList.add("is-loaded"));
    img.addEventListener("error", () => img.classList.add("is-loaded")); // still reveal on error
 
    const sweep = el("div", "card__img-sweep");
    wrap.appendChild(img);
    wrap.appendChild(sweep);
  } else {
    // Animated bar-chart placeholder
    const placeholder = el("div", "card__placeholder");
    const icon = el("div", "placeholder-icon");
 
    for (let i = 0; i < 5; i++) {
      icon.appendChild(el("span"));
    }
 
    const label = el("span", "placeholder-label");
    label.textContent = `${project.tool} · In Planning`;
 
    placeholder.appendChild(icon);
    placeholder.appendChild(label);
    wrap.appendChild(placeholder);
  }
 
  return wrap;
}
 
/**
 * Build a complete project card article element.
 */
function buildCard(project, index) {
  const isComplete = project.status === "Completed";
  const cardClasses = [
    "project-card",
    !isComplete ? "project-card--coming" : "",
  ]
    .filter(Boolean)
    .join(" ");
 
  const article = el("article", cardClasses);
  article.setAttribute("role", "listitem");
  article.setAttribute("aria-label", `Project: ${project.title}`);
 
  // Stagger animation delay based on index
  article.style.animationDelay = `${index * 120}ms`;
 
  // ── Image section ──
  article.appendChild(buildCardImage(project));
 
  // ── Body ──
  const body = el("div", "card__body");
 
  // Header row: number + badge
  const header = el("div", "card__header");
  const number = el("span", "card__number");
  number.textContent = `${project.id} · ${project.tool}`;
 
  const badge = el("span", isComplete ? "card__badge card__badge--done" : "card__badge card__badge--soon");
  badge.textContent = project.status;
 
  header.appendChild(number);
  header.appendChild(badge);
  body.appendChild(header);
 
  // Title
  const title = el("h3", "card__title", project.title);
  body.appendChild(title);
 
  // Description
  const desc = el("p", "card__desc", project.description);
  body.appendChild(desc);
 
  // Tags
  if (project.tags && project.tags.length) {
    const tags = el("div", "card__tags");
    project.tags.forEach((tag) => {
      const tagEl = el("span", isComplete ? "card__tag" : "card__tag card__tag--muted");
      tagEl.textContent = tag;
      tags.appendChild(tagEl);
    });
    body.appendChild(tags);
  }
 
  // Findings
  if (project.findings && project.findings.length) {
    const divider = el("div", "card__divider");
    body.appendChild(divider);
 
    const findLabel = el("p", "card__findings-label");
    findLabel.textContent = project.findingsLabel || "Key Findings";
    body.appendChild(findLabel);
 
    const findList = el("div", "card__findings");
    project.findings.forEach((f) => {
      const finding = el("span", isComplete ? "card__finding" : "card__finding card__finding--muted");
      finding.textContent = f;
      findList.appendChild(finding);
    });
    body.appendChild(findList);
  }
 
  // CTA button
  if (isComplete && project.githubLink) {
    const cta = document.createElement("a");
    cta.className  = "card__cta";
    cta.href       = project.githubLink;
    cta.target     = "_blank";
    cta.rel        = "noopener noreferrer";
    cta.setAttribute("aria-label", `View ${project.title} on GitHub`);
 
    // GitHub octocat icon
    const githubSvg = `<svg viewBox="0 0 16 16" fill="currentColor" width="13" height="13" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>`;
 
    const extSvg = `<svg class="card__cta-ext" viewBox="0 0 10 10" fill="none" width="10" height="10" aria-hidden="true"><path d="M1.5 8.5l7-7M4 1.5h5v5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
 
    cta.innerHTML = `${githubSvg} View on GitHub ${extSvg}`;
    body.appendChild(cta);
  } else {
    const ctaDisabled = el("span", "card__cta card__cta--disabled", "In Progress");
    body.appendChild(ctaDisabled);
  }
 
  article.appendChild(body);
  return article;
}
 
/**
 * Render all project cards into #projects-grid.
 */
function renderProjects() {
  const grid = document.getElementById("projects-grid");
  if (!grid) return;
 
  // Clear any existing content
  grid.innerHTML = "";
 
  if (!portfolioProjects.length) {
    grid.innerHTML = `<p style="color:var(--text-dim);font-family:var(--font-mono);font-size:.8rem;">No projects yet. Add one to the array in main.js.</p>`;
    return;
  }
 
  portfolioProjects.forEach((project, index) => {
    grid.appendChild(buildCard(project, index));
  });
 
  // Wire up intersection observer for scroll-reveal
  observeCards();
}
 
/* ──────────────────────────────────────────────────────────────
   INTERSECTION OBSERVERS
   ────────────────────────────────────────────────────────────── */
 
/**
 * Observe project cards and trigger fade-up animation when in view.
 */
function observeCards() {
  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(".project-card").forEach((c) =>
      c.classList.add("is-visible")
    );
    return;
  }
 
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
 
  document.querySelectorAll(".project-card").forEach((card) => {
    obs.observe(card);
  });
}
 
/**
 * Observe contact section elements and trigger fade-in.
 */
function observeContact() {
  const targets = document.querySelectorAll(
    ".contact__header, .contact__form, .contact__links, .contact__open"
  );
 
  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }
 
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
 
  targets.forEach((el) => obs.observe(el));
}
 
/* ──────────────────────────────────────────────────────────────
   HERO STAT COUNTER
   ────────────────────────────────────────────────────────────── */
function initStatCounters() {
  const statNums = document.querySelectorAll(".hero__stat-number span[data-target]");
  if (!statNums.length) return;
 
  const targets = Array.from(statNums).map((el) =>
    parseInt(el.getAttribute("data-target") || el.textContent, 10)
  );
 
  function countTo(el, target, duration) {
    const start = performance.now();
    (function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    })(performance.now());
  }
 
  const statsBar = document.querySelector(".hero__stats");
  if (!statsBar) return;
 
  if (!("IntersectionObserver" in window)) {
    statNums.forEach((el, i) => countTo(el, targets[i], 1200));
    return;
  }
 
  new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          statNums.forEach((el, i) => countTo(el, targets[i], 1200));
          obs.disconnect();
        }
      });
    },
    { threshold: 0.5 }
  ).observe(statsBar);
}
 
/* ──────────────────────────────────────────────────────────────
   LAZY IMAGE LOADER
   ────────────────────────────────────────────────────────────── */
function initLazyImages() {
  const images = document.querySelectorAll('img[loading="lazy"]');
  images.forEach((img) => {
    if (img.complete) {
      img.classList.add("is-loaded");
    } else {
      img.addEventListener("load",  () => img.classList.add("is-loaded"));
      img.addEventListener("error", () => img.classList.add("is-loaded"));
    }
  });
}
 
/* ──────────────────────────────────────────────────────────────
   NAVIGATION
   ────────────────────────────────────────────────────────────── */
function initNav() {
  const nav      = document.getElementById("main-nav");
  const hamburger = document.getElementById("hamburger");
  const drawer   = document.getElementById("nav-drawer");
 
  if (!nav) return;
 
  // Scroll: add .scrolled class to nav
  window.addEventListener(
    "scroll",
    () => nav.classList.toggle("scrolled", window.scrollY > 40),
    { passive: true }
  );
 
  // Hamburger toggle
  if (hamburger && drawer) {
    hamburger.addEventListener("click", () => {
      const isOpen = drawer.classList.toggle("is-open");
      hamburger.classList.toggle("is-open", isOpen);
      hamburger.setAttribute("aria-expanded", String(isOpen));
      drawer.setAttribute("aria-hidden", String(!isOpen));
    });
 
    // Close drawer when any nav link is clicked
    drawer.querySelectorAll(".nav__link").forEach((link) => {
      link.addEventListener("click", () => {
        drawer.classList.remove("is-open");
        hamburger.classList.remove("is-open");
        hamburger.setAttribute("aria-expanded", "false");
        drawer.setAttribute("aria-hidden", "true");
      });
    });
 
    // Close drawer when clicking outside
    document.addEventListener("click", (e) => {
      if (
        drawer.classList.contains("is-open") &&
        !drawer.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        drawer.classList.remove("is-open");
        hamburger.classList.remove("is-open");
        hamburger.setAttribute("aria-expanded", "false");
        drawer.setAttribute("aria-hidden", "true");
      }
    });
  }
}
 
/* ──────────────────────────────────────────────────────────────
   ACTIVE NAV LINK — SCROLL SPY
   ────────────────────────────────────────────────────────────── */
function initScrollSpy() {
  const navLinks = document.querySelectorAll(".nav__link[href^='#']");
  const sectionIds = Array.from(navLinks).map((link) =>
    link.getAttribute("href").slice(1)
  );
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);
 
  if (!sections.length || !("IntersectionObserver" in window)) return;
 
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            const isActive = link.getAttribute("href") === `#${id}`;
            link.classList.toggle("nav__link--active", isActive);
          });
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
  );
 
  sections.forEach((section) => obs.observe(section));
}
 
/* ──────────────────────────────────────────────────────────────
   DARK / LIGHT THEME TOGGLE
   ────────────────────────────────────────────────────────────── */
function initTheme() {
  const html       = document.documentElement;
  const themeBtn   = document.getElementById("theme-toggle");
 
  // Apply saved preference (or default to dark)
  const saved = localStorage.getItem("portfolio-theme") || "dark";
  html.setAttribute("data-theme", saved);
 
  if (!themeBtn) return;
 
  themeBtn.addEventListener("click", () => {
    const current = html.getAttribute("data-theme");
    const next    = current === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    localStorage.setItem("portfolio-theme", next);
    themeBtn.setAttribute(
      "aria-label",
      next === "dark" ? "Switch to light mode" : "Switch to dark mode"
    );
  });
}
 
/* ──────────────────────────────────────────────────────────────
   FOOTER YEAR
   ────────────────────────────────────────────────────────────── */
function initFooterYear() {
  const el = document.getElementById("footer-year");
  if (el) el.textContent = new Date().getFullYear();
}
 
/* ──────────────────────────────────────────────────────────────
   FORM ENHANCEMENTS
   ────────────────────────────────────────────────────────────── */
function initForm() {
  const form = document.querySelector(".contact__form");
  if (!form) return;
 
  // Basic client-side validation feedback before FormSubmit takes over
  form.addEventListener("submit", (e) => {
    const name    = form.querySelector('[name="name"]');
    const email   = form.querySelector('[name="email"]');
    const message = form.querySelector('[name="message"]');
    let valid = true;
 
    [name, email, message].forEach((field) => {
      if (!field) return;
      if (!field.value.trim()) {
        field.style.borderColor = "#e24b4a";
        valid = false;
      } else {
        field.style.borderColor = "";
      }
    });
 
    if (!valid) {
      e.preventDefault();
    }
  });
 
  // Clear red border on input
  form.querySelectorAll(".form-input").forEach((input) => {
    input.addEventListener("input", () => {
      input.style.borderColor = "";
    });
  });
}
 
/* ──────────────────────────────────────────────────────────────
   URL QUERY: SHOW SUCCESS MESSAGE AFTER FORM SUBMIT
   ────────────────────────────────────────────────────────────── */
function checkFormRedirect() {
  if (new URLSearchParams(window.location.search).get("sent") === "1") {
    // Scroll to contact and show a toast / replace form
    const form = document.querySelector(".contact__form");
    if (form) {
      const success = document.createElement("div");
      success.style.cssText = `
        padding: 1.5rem 2rem;
        background: var(--gold-glass);
        border: 1px solid var(--border-hover);
        border-radius: var(--radius-md);
        font-family: var(--font-mono);
        font-size: .82rem;
        letter-spacing: .06em;
        color: var(--gold);
        text-align: center;
      `;
      success.textContent = "✓  Message received — I'll get back to you soon.";
      form.replaceWith(success);
    }
 
    // Clean the URL without reload
    window.history.replaceState({}, "", window.location.pathname);
 
    // Scroll into view
    const contact = document.getElementById("contact");
    if (contact) contact.scrollIntoView({ behavior: "smooth" });
  }
}
 
/* ──────────────────────────────────────────────────────────────
   BOOT — WIRE EVERYTHING UP
   ────────────────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initFooterYear();
  initNav();
  initScrollSpy();
  renderProjects();      // builds and injects project cards
  observeContact();      // contact section scroll animations
  initStatCounters();    // hero stat number animation
  initLazyImages();      // fade-in lazy images on load
  initForm();            // form validation
  checkFormRedirect();   // show success toast if redirected back
});