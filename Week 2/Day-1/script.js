// Format input fields with leading zero when blurred
function formatWithLeadingZero(id) {
  const input = document.getElementById(id);

  input.addEventListener("blur", function () {
    let val = parseInt(input.value, 10);

    if (!isNaN(val)) {
      if (val < 10) {
        input.value = "0" + val;
      } else {
        input.value = val.toString();
      }
    }
  });
}

// Run formatting logic after the DOM is fully loaded
window.addEventListener("DOMContentLoaded", function () {
  formatWithLeadingZero("day");
  formatWithLeadingZero("month");
});

// Return the number of days in a given month and year
function getDaysInMonth(month, year) {
  const date = new Date(year, month, 0);
  return date.getDate(); // JavaScript handles leap years
}

// Show a temporary warning message
function showWarning(message) {
  const warningBox = document.getElementById("form-warning");

  warningBox.textContent = message;
  warningBox.classList.remove("hidden");

  // Clear any previous timeout to avoid overlap
  clearTimeout(warningBox.hideTimeout);

  // Set timeout to hide warning after 2 seconds
  warningBox.hideTimeout = setTimeout(function () {
    warningBox.classList.add("hidden");
  }, 2000);
}

// Validate the day input based on the selected month and year
function validateDayInput() {
  const dayInput = document.getElementById("day");
  const monthInput = document.getElementById("month");
  const yearInput = document.getElementById("year");

  const day = parseInt(dayInput.value, 10);
  const month = parseInt(monthInput.value, 10);
  const year = parseInt(yearInput.value, 10);

  // If any input is missing or invalid, exit early
  if (!day || !month || !year) {
    return;
  }

  const maxDay = getDaysInMonth(month, year);

  // If user entered an invalid day (e.g., 31 in Feb), correct it
  if (day > maxDay) {
    dayInput.value = maxDay;

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const correctedMonthName = monthNames[month - 1];

    showWarning(
      correctedMonthName + " " + year + " has only " + maxDay + " days",
      true
    );
  }
}

// Attach validation to each input field
["day", "month", "year"].forEach(function (id) {
  const input = document.getElementById(id);
  input.addEventListener("input", validateDayInput);
});

// Animate number increment from start to end over a given duration
function animateValue(id, start, end, duration) {
  const element = document.getElementById(id);
  const range = end - start;

  let increment;

  if (range > 0) {
    increment = 1;
  } else {
    increment = -1;
  }

  let stepTime = Math.floor(Math.abs(duration / range));

  // Fallback step time if range is zero (to prevent divide-by-zero)
  if (stepTime === 0 || !isFinite(stepTime)) {
    stepTime = 20;
  }

  let current = start;

  const timer = setInterval(function () {
    current += increment;
    element.textContent = current;

    if (current === end) {
      clearInterval(timer);
    }
  }, stepTime);
}

// Function to calculate age based on input and update the DOM
function CalcAge() {
  const today = new Date();

  let currentDay = today.getDate();
  let currentMonth = today.getMonth() + 1; // JavaScript months are 0-based
  let currentYear = today.getFullYear();

  let birthDay = parseInt(document.getElementById("day").value, 10);
  let birthMonth = parseInt(document.getElementById("month").value, 10);
  let birthYear = parseInt(document.getElementById("year").value, 10);

  let years = currentYear - birthYear;
  let months = currentMonth - birthMonth;
  let days = currentDay - birthDay;

  // Adjust days and months if the birth day hasn't occurred yet this month
  if (days < 0) {
    months--;

    const daysInPrevMonth = new Date(currentYear, currentMonth - 1, 0).getDate();
    days += daysInPrevMonth;
  }

  // Adjust years if the birth month hasn't occurred yet this year
  if (months < 0) {
    years--;
    months += 12;
  }

  // Animate values into DOM
  animateValue("ageYears", 0, years, 1200);
  animateValue("ageMonths", 0, months, 1200);
  animateValue("ageDays", 0, days, 1200);

  console.log("Calculated Age: " + years + " years, " + months + " months, " + days + " days");
}


// Track if user touched any input
let isTouched = {
  day: false,
  month: false,
  year: false
};

// Add input event listeners to track user interaction
["day", "month", "year"].forEach(function (id) {
  const input = document.getElementById(id);

  input.addEventListener("input", function () {
    isTouched[id] = true;
  });
});

const form = document.getElementById("ageForm");
const warningBox = document.getElementById("form-warning");

// Show warning message, with optional "Auto-Corrected" tag
function showWarning(message, autoCorrected) {
  if (autoCorrected === true) {
    warningBox.innerHTML = message + ' <span class="text-green-600 font-semibold ml-1">Auto-Corrected</span>';
  } else {
    warningBox.innerHTML = message;
  }

  warningBox.classList.remove("hidden");

  // Hide warning when user clicks anywhere after showing
  function hideWarning() {
    warningBox.classList.add("hidden");
    document.removeEventListener("click", hideWarning);
  }

  setTimeout(function () {
    document.addEventListener("click", hideWarning);
  }, 0);

  // Automatically hide warning after 1.5 seconds
  setTimeout(function () {
    warningBox.classList.add("hidden");
  }, 1500);
}

// Handle form submission
form.addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent page reload on form submission

  const untouched =
    isTouched.day === false &&
    isTouched.month === false &&
    isTouched.year === false;

  if (untouched) {
    showWarning("Please update the date before submitting.");
  } else {
    CalcAge(); // Calculate and display the age

    // Reset form fields to empty
    form.reset();

    // Reset touched tracking
    isTouched.day = false;
    isTouched.month = false;
    isTouched.year = false;
  }
});
