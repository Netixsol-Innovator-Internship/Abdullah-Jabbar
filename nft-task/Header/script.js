// script.js
document.addEventListener("DOMContentLoaded", () => {
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const hamburgerIcon = document.getElementById("hamburgerIcon");
  const closeIcon = document.getElementById("closeIcon");

  hamburgerBtn.addEventListener("click", () => {
    // Slide menu in/out
    mobileMenu.classList.toggle("translate-x-full");
    mobileMenu.classList.toggle("translate-x-0");

    // Swap icons
    hamburgerIcon.classList.toggle("hidden");
    closeIcon.classList.toggle("hidden");

    // Prevent body scroll when open
    document.body.classList.toggle("overflow-hidden");
  });

  // Close when any link is clicked
  mobileMenu.querySelectorAll("a, button").forEach((el) => {
    el.addEventListener("click", () => {
      mobileMenu.classList.add("translate-x-full");
      mobileMenu.classList.remove("translate-x-0");
      hamburgerIcon.classList.remove("hidden");
      closeIcon.classList.add("hidden");
      document.body.classList.remove("overflow-hidden");
    });
  });
});
