import { quizzes } from "./quizData.js";

document.addEventListener("DOMContentLoaded", () => {

  
  const toggleBtn = document.getElementById("menu-toggle");
  const navPanel = document.getElementById("mobile-nav-panel");

  if (toggleBtn && navPanel) {
    // ✅ Toggle nav panel
    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      navPanel.classList.toggle("-translate-x-full");
      navPanel.classList.toggle("translate-x-0");
    });

    // ✅ Close nav panel on outside click
    document.addEventListener("click", (e) => {
      const isClickInsidePanel = navPanel.contains(e.target);
      const isClickOnToggle = toggleBtn.contains(e.target);
      const isPanelOpen = !navPanel.classList.contains("-translate-x-full");

      if (!isClickInsidePanel && !isClickOnToggle && isPanelOpen) {
        navPanel.classList.add("-translate-x-full");
        navPanel.classList.remove("translate-x-0");
      }
    });

    // ✅ Optional: Close on focus-out (keyboard navigation)
    document.addEventListener("focusin", (e) => {
      const isFocusInside =
        navPanel.contains(e.target) || toggleBtn.contains(e.target);
      const isPanelOpen = !navPanel.classList.contains("-translate-x-full");

      if (!isFocusInside && isPanelOpen) {
        navPanel.classList.add("-translate-x-full");
        navPanel.classList.remove("translate-x-0");
      }
    });
  }

  // ✅ Highlight current nav link
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function () {
      document
        .querySelectorAll(".nav-link")
        .forEach((l) => l.classList.remove("bg-gray-200"));
      this.classList.add("bg-gray-200");
    });
  });

  //  Show section by ID
  window.showSection = function (idToShow) {
    document.querySelectorAll("section").forEach((section) => {
      section.classList.add("hidden");
    });
    const targetSection = document.getElementById(idToShow);
    if (targetSection) {
      targetSection.classList.remove("hidden");
    }
  };


// _________________________________Form Validation Code_____________________________________________________

document.getElementById('signupForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent page reload

    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Simple validations
    if (fullName === '') {
      alert('Full name is required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      alert('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    // If everything passes
    showSection('profile'); // Custom function you already use
  });


   document
     .getElementById("loginForm")
     .addEventListener("submit", function (e) {
       e.preventDefault(); // Prevent form submission (page reload)

       const email = document.getElementById("loginEmail").value.trim();
       const password = document.getElementById("loginPassword").value;

       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

       if (!emailRegex.test(email)) {
         alert("Please enter a valid email address.");
         return;
       }

       if (password.length < 6) {
         alert("Password must be at least 6 characters.");
         return;
       }

       // If validation passes
       showSection("profile"); // Call your existing function
     });

  // ------------------------
});
