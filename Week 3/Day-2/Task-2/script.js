document.addEventListener("DOMContentLoaded", () => {
  
const themeToggle = document.getElementById('theme-toggle');
const bodyElement = document.body;
const headerElemnt = document.getElementById('pageHeader');

// Helper function to set theme classes explicitly
function setTheme(isDark) {
  if (isDark) {
    bodyElement.classList.remove('bg-black');
    bodyElement.classList.add('bg-white');

    headerElemnt.classList.remove('bg-black');
    headerElemnt.classList.add('bg-white');

    localStorage.setItem('theme', 'dark');
  } else {
    bodyElement.classList.remove('bg-white');
    headerElemnt.classList.remove('bg-white');

    bodyElement.classList.add('bg-black');
    headerElemnt.classList.add('bg-black');

    localStorage.setItem('theme', 'light');
  }
}

  // Initialize based on saved preference or default to light
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    setTheme(true);
    themeToggle.checked = true;
  } else {
    setTheme(false);
    themeToggle.checked = false;
  }

  // Listen for toggle changes
  themeToggle.addEventListener('change', (e) => {
    setTheme(e.target.checked);
  });
    // ________________________________________________________

  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const closeMenuBtn = document.getElementById("closeMenu"); // may be null if not present

  // select all nav anchors (desktop + mobile)
  const allNavLinks = document.querySelectorAll("nav a[href]");

  // classes used for the active state in your markup
  const ACTIVE_CLASSES = [
    "border-b-2",
    "border-gray-400",
    "pb-1",
    "text-gray-900",
    "font-semibold"
  ];

  // helpers
  function openMobile() {
    if (hamburgerBtn) hamburgerBtn.classList.add("open");
    if (mobileMenu) mobileMenu.classList.remove("hidden");
  }

  function closeMobile() {
    if (hamburgerBtn) hamburgerBtn.classList.remove("open");
    if (mobileMenu) mobileMenu.classList.add("hidden");
  }

  // toggle mobile menu
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener("click", (e) => {
      // prevent document click handler from immediately closing it
      e.stopPropagation();
      hamburgerBtn.classList.toggle("open");
      if (mobileMenu) mobileMenu.classList.toggle("hidden");
    });
  }

  // close button inside mobile menu
  if (closeMenuBtn) {
    closeMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeMobile();
    });
  }

  // click outside mobile menu to close
  document.addEventListener("click", (e) => {
    if (!mobileMenu || !hamburgerBtn) return;
    const target = e.target;
    if (!mobileMenu.contains(target) && !hamburgerBtn.contains(target)) {
      closeMobile();
    }
  });

  // focus shift: close when focus moves outside mobile menu + hamburger
  document.addEventListener("focusin", (e) => {
    if (!mobileMenu || !hamburgerBtn) return;
    if (!mobileMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
      closeMobile();
    }
  });

  // active class handling
  function clearActiveFromAll() {
    allNavLinks.forEach(a => {
      ACTIVE_CLASSES.forEach(cls => a.classList.remove(cls));
    });
  }

  allNavLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      // set active only on the clicked link
      clearActiveFromAll();
      ACTIVE_CLASSES.forEach(cls => link.classList.add(cls));

      // if the clicked link is inside mobileMenu, close the mobile menu
      if (mobileMenu && mobileMenu.contains(link)) {
        closeMobile();
      }
    });
  });
});
