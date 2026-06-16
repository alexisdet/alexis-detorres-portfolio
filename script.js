const quotes = [
  { text: "It was a pleasure to work with Alexis. She made sure to put her 100 in everything she did.", by: "Senior Consultant, Ryan" },
  { text: "Alexis's curiosity not only helped her network to get new projects, but it showed her work ethic to the whole company.", by: "Managing Director, Protiviti" },
  { text: "Her curiosity and analytical discipline stand out. She asks the right questions and follows through deeply.", by: "Professor Liming Le, Physics" }
];

let quoteIndex = 0;

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  document.body.classList.toggle("dark-mode", theme === "dark");
  localStorage.setItem("theme", theme);
  const modeToggle = document.getElementById("modeToggle");
  if (modeToggle) {
    modeToggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    modeToggle.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    modeToggle.title = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
  }
}

function initTheme() {
  const saved = localStorage.getItem("theme");
  setTheme(saved || "dark");
  const modeToggle = document.getElementById("modeToggle");
  if (modeToggle) {
    modeToggle.addEventListener("click", () => {
      const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      setTheme(next);
    });
  }
}

function renderQuote() {
  const body = document.getElementById("quoteBody");
  const dots = document.getElementById("quoteDots");
  if (!body || !dots) return;
  const q = quotes[quoteIndex];
  body.innerHTML = `<blockquote>"${q.text}"</blockquote><p>${q.by}</p>`;
  dots.innerHTML = quotes.map((_, i) => `<button ${i === quoteIndex ? 'class="active"' : ""} aria-label="Go to quote ${i + 1}"></button>`).join("");
  [...dots.children].forEach((dot, i) => dot.addEventListener("click", () => { quoteIndex = i; renderQuote(); }));
}

function initCarousel() {
  const prev = document.getElementById("prevTestimonial");
  const next = document.getElementById("nextTestimonial");
  if (!prev || !next) return;
  renderQuote();
  prev.addEventListener("click", () => { quoteIndex = (quoteIndex - 1 + quotes.length) % quotes.length; renderQuote(); });
  next.addEventListener("click", () => { quoteIndex = (quoteIndex + 1) % quotes.length; renderQuote(); });
}

function initReveal() {
  const items = document.querySelectorAll(".reveal");
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("visible"); });
  }, { threshold: 0.15 });
  items.forEach((it) => obs.observe(it));
}

function initCursor() {
  const dot = document.getElementById("cursorDot");
  if (!dot || window.matchMedia("(max-width: 680px)").matches) return;
  window.addEventListener("mousemove", (e) => {
    dot.style.left = `${e.clientX}px`;
    dot.style.top = `${e.clientY}px`;
  });
}

function initLoader() {
  const loader = document.getElementById("loader");
  if (loader) loader.remove();
}

initTheme();
initCarousel();
initReveal();
initLoader();
