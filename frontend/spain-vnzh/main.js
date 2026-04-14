const API_URL = "http://127.0.0.1:5000/api/leads";

function initTopStart() {
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  window.scrollTo(0, 0);
  window.addEventListener("pageshow", () => {
    window.scrollTo(0, 0);
  });
}

function initStickyNav() {
  const nav = document.querySelector("[data-nav]");
  if (!nav) {
    return;
  }
  const onScroll = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function initMobileMenu() {
  const nav = document.querySelector("[data-nav]");
  const burger = document.querySelector("[data-burger-btn]");
  if (!nav || !burger) return;

  burger.addEventListener("click", () => {
    nav.classList.toggle("is-open");
  });

  nav.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
    });
  });
}

function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const target = document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function initDisableMobileZoom() {
  ["gesturestart", "gesturechange", "gestureend"].forEach((eventName) => {
    document.addEventListener(eventName, (event) => {
      event.preventDefault();
    }, { passive: false });
  });
}

function initRevealAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("in-view");
    });
  }, { threshold: 0.2 });

  document.querySelectorAll("[data-reveal]").forEach((el) => {
    if (el.matches("section, header, footer, main")) {
      el.classList.add("in-view");
      return;
    }
    observer.observe(el);
  });
}

function initScrollProgress() {
  const progress = document.querySelector("[data-scroll-progress]");
  if (!progress) return;

  const updateProgress = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const percent = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
    progress.style.width = `${percent}%`;
  };

  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();
}

function initHeroParallax() {
  document.querySelectorAll("[data-parallax]").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `rotateY(${x * 6}deg) rotateX(${y * -6}deg)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "rotateY(0deg) rotateX(0deg)";
    });
  });
}

function initLeadForm() {
  document.querySelectorAll("[data-form]").forEach((form) => {
    const status = form.querySelector("[data-status]");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const payload = {
        site: document.body.dataset.site || "spain_vnzh",
        name: form.elements.name.value.trim(),
        phone: form.elements.phone.value.trim(),
        telegram: form.elements.telegram.value.trim(),
        situation: form.elements.situation.value.trim()
      };

      status.textContent = "Отправляем...";
      status.classList.remove("error");
      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error("Request failed");
        form.reset();
        status.textContent = "Спасибо! Мы скоро свяжемся.";
      } catch (_error) {
        status.textContent = "Ошибка отправки. Попробуйте позже.";
        status.classList.add("error");
      }
    });
  });
}

function initFaqAccordion() {
  const items = document.querySelectorAll(".faq-item");
  items.forEach((item) => {
    const btn = item.querySelector(".faq-question");
    const panel = item.querySelector(".faq-answer");
    if (!btn || !panel) return;
    btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      items.forEach((other) => {
        other.classList.remove("open");
        const otherPanel = other.querySelector(".faq-answer");
        if (otherPanel) otherPanel.style.maxHeight = "0px";
      });
      if (!isOpen) {
        item.classList.add("open");
        panel.style.maxHeight = `${panel.scrollHeight}px`;
      }
    });
  });
}

initTopStart();
initStickyNav();
initMobileMenu();
initSmoothAnchors();
initRevealAnimations();
initScrollProgress();
initHeroParallax();
initFaqAccordion();
initLeadForm();
initDisableMobileZoom();


