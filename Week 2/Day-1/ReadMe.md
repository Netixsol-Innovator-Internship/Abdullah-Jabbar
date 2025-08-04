# Age Calculator – JavaScript DOM Practice

## Project Overview

This project is a browser-based age calculator built using HTML, Tailwind CSS, and JavaScript. It allows a user to input their birth date and returns their age in years, months, and days. The main goal of building this app was to reinforce my understanding of core JavaScript concepts, especially working with the DOM, handling events, and accessing HTML elements through JavaScript.

## Learning Goals

My main focus for the day was to:

- Practice DOM element selection methods
- Understand how to read and manipulate form inputs
- Use event listeners to trigger logic dynamically
- Apply JavaScript basics like conditionals, functions, and date handling

## What I Practiced

### JavaScript Fundamentals

- Used `parseInt()` for type conversion from string to number
- Performed basic arithmetic and conditional checks
- Created functions to modularize logic (e.g., age calculation, validation)
- Handled edge cases like leap years and month boundaries using the `Date` object

### DOM Manipulation

- Accessed elements using `document.getElementById()`
- Updated text in the DOM using `.textContent` and `.innerHTML`
- Showed or hid warning messages using `.classList.add()` / `.remove()`
- Listened for user interactions using `.addEventListener()` for `blur`, `input`, and `submit` events

### Form Validation and User Feedback

- Prevented form submission from reloading the page using `e.preventDefault()`
- Checked for invalid day-month combinations (e.g., February 30) and corrected them automatically
- Displayed warnings when the input was invalid or untouched
- Reset form and internal state after successful submission

### Input Tracking

- Tracked whether the user interacted with any input fields using a simple `isTouched` object
- Ensured age wasn't calculated until the user updated at least one field


## Technologies Used

- HTML5 for structure
- Tailwind CSS for layout and responsiveness
- Vanilla JavaScript for interactivity and logic


