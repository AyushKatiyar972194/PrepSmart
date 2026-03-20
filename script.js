/* Interactivity for the PrepSmart homepage. */

function $(selector, root = document) {
  return root.querySelector(selector);
}

function $all(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

function setModalOpen(isOpen) {
  const overlay = $("#modal-overlay");
  const modalRoot = $("#modal-root");
  if (!overlay || !modalRoot) return;

  if (isOpen) {
    overlay.classList.remove("hidden");
    modalRoot.classList.remove("hidden");
    overlay.setAttribute("aria-hidden", "false");
    modalRoot.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  } else {
    overlay.classList.add("hidden");
    modalRoot.classList.add("hidden");
    overlay.setAttribute("aria-hidden", "true");
    modalRoot.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
}

function openModal(templateId) {
  const tpl = $(`#tpl-${templateId}`);
  if (!tpl) return;

  const modalTitle = $("#modal-title");
  const modalSubtitle = $("#modal-subtitle");
  const modalBody = $("#modal-body");
  const modalPrimary = $("#modal-primary");

  const titles = {
    "quiz-modal": { t: "Quiz Preview", s: "A quick demo of how your quiz will feel." },
    "resume-modal": { t: "Resume Builder", s: "A preview of the resume checklist workflow." },
    "jobs-modal": { t: "Job Picks", s: "Curated opportunities tailored for placements." },
    "progress-modal": { t: "Progress Dashboard", s: "Track practice and know what to do next." },
    "signup-modal": { t: "Get Started", s: "Choose your focus to personalize your journey." },
  };

  const meta = titles[templateId] || { t: "PrepSmart", s: "" };
  modalTitle.textContent = meta.t;
  modalSubtitle.textContent = meta.s;

  modalBody.innerHTML = "";
  const content = tpl.content.cloneNode(true);
  modalBody.appendChild(content);

  modalPrimary.textContent = templateId === "signup-modal" ? "Save Choice" : "Continue";

  // Simple behavior for signup chips (demo).
  if (templateId === "signup-modal") {
    const chips = $all(".chip", modalBody);
    const signupChoice = $("#signup-choice", modalBody);

    chips.forEach((chip) => {
      chip.setAttribute("aria-pressed", "false");
      chip.addEventListener("click", () => {
        chips.forEach((c) => c.setAttribute("aria-pressed", "false"));
        chip.setAttribute("aria-pressed", "true");

        const choice = chip.getAttribute("data-chip") || "None";
        const labelMap = {
          quiz: "Aptitude",
          resume: "Resume",
          jobs: "Jobs",
          track: "Tracking",
        };
        signupChoice.innerHTML = `Selected: <span class="font-semibold">${
          labelMap[choice] || "None"
        }</span>`;
      });
    });

    modalPrimary.onclick = () => {
      const current = ($(".font-semibold", modalBody) || null)?.textContent?.trim() || "";
      setModalOpen(false);
      // In the full app this would proceed to onboarding.
      alert(current ? `Choice saved: ${current}` : "Choice saved.");
    };
  } else {
    modalPrimary.onclick = () => {
      setModalOpen(false);
    };
  }

  setModalOpen(true);
}

function scrollToId(id) {
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

function initHeader() {
  const header = $("#site-header");
  if (!header) return;

  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY > 10;
    header.classList.toggle("scrolled", scrolled);
  });
}

function initMobileMenu() {
  const toggle = $("#menu-toggle");
  const menu = $("#mobile-menu");
  if (!toggle || !menu) return;

  const setExpanded = (expanded) => {
    toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
    menu.classList.toggle("hidden", !expanded);
  };

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    setExpanded(!expanded);
  });

  // Close menu on link click (mobile).
  $all('#mobile-menu a[href^="#"]').forEach((a) => {
    a.addEventListener("click", () => setExpanded(false));
  });
}

function initNavHighlight() {
  const headerOffset = 110; // matches fixed header + breathing room
  const links = $all('[data-nav]');
  if (!links.length) return;

  const ids = Array.from(new Set(links.map((l) => l.getAttribute("data-nav")).filter(Boolean)));

  const elements = ids.map((id) => document.getElementById(id)).filter(Boolean);
  if (!elements.length) return;

  const obs = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const id = visible.target.id;

      links.forEach((a) => {
        const navId = a.getAttribute("data-nav");
        const active = navId === id;
        a.classList.toggle("active", active);
      });
    },
    {
      root: null,
      rootMargin: `-${headerOffset}px 0px -60% 0px`,
      threshold: [0.1, 0.25, 0.5],
    }
  );

  elements.forEach((el) => obs.observe(el));
}

function initSmoothScroll() {
  // Smooth-scroll for internal anchor links.
  $all('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href") || "";
      const id = href.replace("#", "");
      if (!id) return;
      e.preventDefault();
      scrollToId(id);
    });
  });

  // Buttons that request scroll.
  $all("[data-scroll-to]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-scroll-to") || "";
      if (id) scrollToId(id);
    });
  });
}

function initModal() {
  // Open modal buttons: [data-modal-open="progress-modal"]
  $all("[data-modal-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const templateId = btn.getAttribute("data-modal-open");
      if (!templateId) return;
      openModal(templateId);
    });
  });

  // Close controls
  const overlay = $("#modal-overlay");
  const closeBtn = $("#modal-close");

  if (overlay) overlay.addEventListener("click", () => setModalOpen(false));
  if (closeBtn) closeBtn.addEventListener("click", () => setModalOpen(false));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setModalOpen(false);
  });

  // Primary close behavior for modal overlay click already set.
}

function initProgressAnimation() {
  // Keep it simple: animate the hero progress bar slightly after load.
  const fill = $("#progress-fill");
  const percent = $("#progress-percent");
  if (!fill || !percent) return;

  const target = 35;
  let current = 0;
  const start = performance.now();
  const duration = 900;

  const tick = (now) => {
    const t = Math.min(1, (now - start) / duration);
    current = Math.round(target * t);
    fill.style.width = `${current}%`;
    percent.textContent = `${current}`;
    const modalVal = $("#modal-progress-val");
    if (modalVal) modalVal.textContent = `${current}%`;
    const modalFill = $("#modal-progress-fill");
    if (modalFill) modalFill.style.width = `${current}%`;
    if (t < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

function initYear() {
  const yearEl = $("#year");
  if (!yearEl) return;
  yearEl.textContent = String(new Date().getFullYear());
}

function init() {
  initHeader();
  initMobileMenu();
  initNavHighlight();
  initSmoothScroll();
  initModal();
  initProgressAnimation();
  initYear();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

