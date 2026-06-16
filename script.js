const quotes = [
  { text: "It was a pleasure to work with Alexis. She made sure to put her 100 in everything she did.", by: "Senior Consultant, Ryan" },
  { text: "Alexis's curiosity not only helped her network to get new projects, but it showed her work ethic to the whole company.", by: "Managing Director, Protiviti" },
  { text: "Her curiosity and analytical discipline stand out. She asks the right questions and follows through deeply.", by: "Professor Liming Le, Physics" }
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

initTheme();
initCarousel();
initReveal();
initLoader();
