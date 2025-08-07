document.addEventListener("DOMContentLoaded", () => {
  const tipButtons = document.querySelectorAll(".tip-btn");
  const customTipInput = document.getElementById("custom-tip");
  const billInput = document.getElementById("bill");
  const peopleInput = document.getElementById("people");
  const tipAmountOutput = document.getElementById("tip-amount");
  const totalAmountOutput = document.getElementById("total-amount");
  const resetButton = document.getElementById("reset-btn");
  const peopleError = document.getElementById("people-error");

  let bill = 0;
  let tipPercentage = 0;
  let people = 0;

  const resetTipButtonsUI = () => {
    tipButtons.forEach((btn) => {
      btn.classList.remove("bg-green-400", "text-green-900");
      btn.classList.add("bg-green-900", "text-white");
    });
  };

  const calculateTip = () => {
    if (bill <= 0 || people <= 0) {
      tipAmountOutput.textContent = "$0.00";
      totalAmountOutput.textContent = "$0.00";
      return;
    }

    const totalTip = bill * tipPercentage;
    const totalBill = bill + totalTip;

    const tipPerPerson = totalTip / people;
    const totalPerPerson = totalBill / people;

    tipAmountOutput.textContent = `$${tipPerPerson.toFixed(2)}`;
    totalAmountOutput.textContent = `$${totalPerPerson.toFixed(2)}`;
  };

  billInput.addEventListener("input", (e) => {
    bill = parseFloat(e.target.value) || 0;
    calculateTip();
  });

  peopleInput.addEventListener("input", (e) => {
    people = parseInt(e.target.value) || 0;
    if (people <= 0) {
      peopleError.classList.remove("hidden");
      peopleInput.classList.add("ring-2", "ring-red-500");
    } else {
      peopleError.classList.add("hidden");
      peopleInput.classList.remove("ring-2", "ring-red-500");
    }
    calculateTip();
  });

  tipButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Reset UI
      resetTipButtonsUI();
      customTipInput.value = "";

      // Highlight selected
      button.classList.remove("bg-green-900", "text-white");
      button.classList.add("bg-green-400", "text-green-900");

      // Set tip value
      tipPercentage = parseFloat(button.dataset.tip);
      calculateTip();
    });
  });

  customTipInput.addEventListener("focus", () => {
    resetTipButtonsUI();
  });

  customTipInput.addEventListener("input", (e) => {
    resetTipButtonsUI();
    const customTipValue = parseFloat(e.target.value) || 0;
    tipPercentage = customTipValue / 100;
    calculateTip();
  });

  resetButton.addEventListener("click", () => {
    billInput.value = "";
    peopleInput.value = "";
    customTipInput.value = "";
    bill = 0;
    tipPercentage = 0;
    people = 0;

    tipAmountOutput.textContent = "$0.00";
    totalAmountOutput.textContent = "$0.00";

    resetTipButtonsUI();
    peopleError.classList.add("hidden");
    peopleInput.classList.remove("ring-2", "ring-red-500");
  });
});
