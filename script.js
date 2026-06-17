const quotes = [
  { text: "In less than two weeks on a live complex account, Alexis demonstrated exceptional initiative and ownership. She quickly understood campaign operations, anticipated project needs, and consistently delivered high quality work with minimal direction. Her ability to organize complex workflows and improve team efficiency made an immediate impact.", by: "Protiviti Manager" },
  { text: "Alexis brought a quality over quantity mindset to every project. She asked thoughtful questions, proactively identified opportunities for improvement, and consistently went beyond assigned responsibilities. Her curiosity and drive made her someone the team could rely on.", by: "Ryan, Senior Consultant" },
  { text: "Alexis was the top student in my physics class, standing out not only for her academic performance but also for her persistence and analytical thinking. She approached challenging problems with discipline and creativity, qualities that will serve her well in any leadership role.", by: "Professor Liming Le" }
];

let quoteIndex = 0;

function safeStorageGet(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}

function safeStorageSet(key, value) {
  try { localStorage.setItem(key, value); } catch { /* Theme still works without storage. */ }
}

function setTheme(theme) {
  const nextTheme = theme === "light" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", nextTheme);
  document.body.classList.toggle("dark-mode", nextTheme === "dark");
  safeStorageSet("theme", nextTheme);

  const modeToggle = document.getElementById("modeToggle");
  if (modeToggle) {
    modeToggle.setAttribute("aria-pressed", nextTheme === "dark" ? "true" : "false");
    modeToggle.setAttribute("aria-label", nextTheme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    modeToggle.title = nextTheme === "dark" ? "Switch to light mode" : "Switch to dark mode";
  }
}

function initTheme() {
  const saved = safeStorageGet("theme");
  setTheme(saved || "dark");

  const modeToggle = document.getElementById("modeToggle");
  if (modeToggle) {
    modeToggle.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      setTheme(current === "dark" ? "light" : "dark");
    });
  }
}

function renderQuote() {
  const body = document.getElementById("quoteBody");
  const dots = document.getElementById("quoteDots");
  if (!body || !dots) return;

  const q = quotes[quoteIndex];
  body.innerHTML = `<blockquote>"${q.text}"</blockquote><p>${q.by}</p>`;
  dots.innerHTML = quotes
    .map((_, i) => `<button ${i === quoteIndex ? 'class="active"' : ""} aria-label="Go to quote ${i + 1}"></button>`)
    .join("");

  [...dots.children].forEach((dot, i) => {
    dot.addEventListener("click", () => {
      quoteIndex = i;
      renderQuote();
    });
  });
}

function initCarousel() {
  const prev = document.getElementById("prevTestimonial");
  const next = document.getElementById("nextTestimonial");
  renderQuote();
  if (!prev || !next) return;

  prev.addEventListener("click", () => {
    quoteIndex = (quoteIndex - 1 + quotes.length) % quotes.length;
    renderQuote();
  });
  next.addEventListener("click", () => {
    quoteIndex = (quoteIndex + 1) % quotes.length;
    renderQuote();
  });
}

function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("visible"));
    return;
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

  items.forEach((item) => obs.observe(item));
}

function initLoader() {
  const loader = document.getElementById("loader");
  if (loader) loader.remove();
}

function initCompanyLogoMagnet() {
  const wall = document.getElementById("companyLogoWall");
  if (!wall) return;

  const icons = [...wall.querySelectorAll(".logo-tile")];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!icons.length || reduceMotion) return;

  let frame = 0;
  const resetIcon = (icon) => {
    icon.style.setProperty("--mx", "0px");
    icon.style.setProperty("--my", "0px");
    icon.style.setProperty("--mz", "0px");
    icon.style.setProperty("--scale", "1");
  };

  wall.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      icons.forEach((icon) => {
        const rect = icon.getBoundingClientRect();
        const iconX = rect.left + rect.width / 2;
        const iconY = rect.top + rect.height / 2;
        const dx = event.clientX - iconX;
        const dy = event.clientY - iconY;
        const distance = Math.hypot(dx, dy);
        const strength = Math.max(0, 1 - distance / 170);
        const pull = strength * 0.18;

        icon.style.setProperty("--mx", `${dx * pull}px`);
        icon.style.setProperty("--my", `${dy * pull}px`);
        icon.style.setProperty("--mz", `${strength * 38}px`);
        icon.style.setProperty("--scale", `${1 + strength * 0.18}`);
      });
    });
  });

  wall.addEventListener("pointerleave", () => {
    cancelAnimationFrame(frame);
    icons.forEach(resetIcon);
  });

  icons.forEach((icon) => {
    icon.addEventListener("blur", () => resetIcon(icon));
  });
}

initTheme();
initCarousel();
initReveal();
initCompanyLogoMagnet();
initLoader();
