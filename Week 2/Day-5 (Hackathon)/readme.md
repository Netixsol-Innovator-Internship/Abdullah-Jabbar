# QuizMaster

**QuizMaster** is a responsive single-page quiz application built using **HTML**, **Tailwind CSS**, and **JavaScript**. The layout strictly follows Figma-defined sizes, and client-side routing is handled via toggling multiple sections in the same HTML file.

---

## Overview

The application doesn't use traditional page-based routing. Instead, it renders everything inside a single HTML document. Different app states (home, quiz, profile, etc.) are represented by distinct `<section>` elements, each initially `hidden`, and toggled into view using JavaScript. Applied Input Validations for Email and Password.

---

## Implemented Sections

The following sections are defined with exact `id`s for programmatic control:

- `#heroSection` — Landing screen with call to action
- ``#signUpSection` — New user registration
- `#loginSection` — Existing user login
- `#quizSelectSection` — List of available quizzes
- `#quiz` — Quiz questions, timer, and progress
- `#profile` — User profile UI (hidden by default)
- `#quizResult` see final score
- `#review` — Post-quiz feedback and answer review

Each section uses Tailwind utility classes with extended spacing (e.g., `max-w-240`, `max-h-241.5`, `p-7.5`, etc.) to mirror the exact Figma specs. Made Data file as module and fixed the issues (export keyword not added)

---

## Section Routing

The core of the app's "routing" is handled by the `showSection(id)` function, defined in `main.js`.

```js
function showSection(id) {
  const sections = document.querySelectorAll("section");
  sections.forEach((section) => section.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}
