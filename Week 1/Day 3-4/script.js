// script.js
const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("mobile-nav");
const closeMenu = document.getElementById("close-menu");

hamburger.addEventListener("click", () => {
  mobileNav.classList.remove("translate-x-full");
});

closeMenu.addEventListener("click", () => {
  mobileNav.classList.add("translate-x-full");
});
  
document.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement;
  const toggleBtn = document.getElementById("theme-toggle");
  const indicator = document.getElementById("indicator");

  function setTheme(mode) {
    const isDark = mode === "dark";
    html.classList.toggle("dark", isDark);
    localStorage.setItem("theme", mode);

    // Slide the indicator circle to the correct icon
    indicator.style.transform = isDark ? "translateX(0)" : "translateX(127%)";
  }

  toggleBtn.addEventListener("click", () => {
    const isDark = html.classList.contains("dark");
    setTheme(isDark ? "light" : "dark");
  });

  // On load: apply stored or system preference
  const stored = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialMode = stored || (prefersDark ? "dark" : "light");
  setTheme(initialMode);
});
