const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
const navLinks = mobileMenu.querySelectorAll('nav a');
const contactBtn = mobileMenu.querySelector('div > a'); // Contact Us button

// Function to close the menu
function closeMenu() {
  hamburgerBtn.classList.remove('open');
  mobileMenu.classList.add('hidden');
}

// Toggle menu open/close on hamburger click
hamburgerBtn.addEventListener('click', () => {
  hamburgerBtn.classList.toggle('open');
  mobileMenu.classList.toggle('hidden');
});

// Close menu when clicking on any nav link
navLinks.forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Close menu when clicking on contact button
contactBtn.addEventListener('click', closeMenu);

// Close menu when clicking outside the menu content
mobileMenu.addEventListener('click', (event) => {
  if (event.target === mobileMenu) {
    closeMenu();
  }


  // nav links bottom-border highlight code:
  // Common active classes
const activeClasses = ["border-b-2", "border-blue-400", "pb-1", "text-gray-900", "font-semibold"];

// Select all nav links (desktop + mobile)
const allNavLinks = document.querySelectorAll(
  'nav a[href]' // All anchor links inside navs
);

// Function to set active link
function setActiveLink(link) {
  // Remove active classes from all links
  allNavLinks.forEach(a => {
    activeClasses.forEach(cls => a.classList.remove(cls));
  });

  // Add active classes to clicked link
  activeClasses.forEach(cls => link.classList.add(cls));
}

// Add click event to each link
allNavLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    setActiveLink(link);
  });
});

});
