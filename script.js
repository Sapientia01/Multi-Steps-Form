const pages = document.querySelectorAll(".page");
const nextBtns = document.querySelectorAll(".next-btn");
const prevBtns = document.querySelectorAll(".prev-btn");
const submitBtn = document.querySelector(".submit-btn");
const steps = document.querySelectorAll(".step");
const bullets = document.querySelectorAll(".bullet");
let current = 0;
let maxStepReached = 0;

// Show first page initially
showPage(0);
updateProgress();

// Add click events to steps
steps.forEach((step) => {
  step.addEventListener("click", () => {
    const stepNum = parseInt(step.dataset.step);
    if (stepNum <= maxStepReached) {
      current = stepNum;
      showPage(current);
      updateProgress();
    }
  });
});

function updateProgress() {
  steps.forEach((step, index) => {
    const bullet = step.querySelector(".bullet");
    if (index <= maxStepReached) {
      bullet.classList.add("active");
      step.classList.add("active");
    } else {
      bullet.classList.remove("active");
      step.classList.remove("active");
    }
  });
}

function showPage(pageIndex) {
  pages.forEach((page, index) => {
    if (index === pageIndex) {
      page.classList.add("active");
    } else {
      page.classList.remove("active");
    }
  });
}

function showError(input, message) {
  const field = input.closest(".field");
  const errorMessage = field.querySelector(".error-message");
  errorMessage.textContent = message;
  input.classList.add("error");
}

function clearError(input) {
  const field = input.closest(".field");
  const errorMessage = field.querySelector(".error-message");
  errorMessage.textContent = "";
  input.classList.remove("error");
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  return /^\+\d{1,3}\s\d{9}$/.test(phone);
}

function validatePassword(password) {
  return password.length >= 8;
}

function validateName(name) {
  return name.length >= 2 && /^[a-zA-Z\s]*$/.test(name);
}

function validateCurrentStep() {
  const currentPage = pages[current];
  const inputs = currentPage.querySelectorAll("input[required]");
  let isValid = true;

  inputs.forEach((input) => {
    clearError(input);

    if (!input.value) {
      isValid = false;
      showError(input, "This field is required");
    } else {
      switch (input.type) {
        case "text":
          if (!validateName(input.value)) {
            isValid = false;
            showError(input, "Please enter a valid name (letters only)");
          }
          break;
        case "email":
          if (!validateEmail(input.value)) {
            isValid = false;
            showError(input, "Please enter a valid email address");
          }
          break;
        case "tel":
          if (!validatePhone(input.value)) {
            isValid = false;
            showError(input, "Format: +x xxxxxxxxx");
          }
          break;
        case "password":
          if (!validatePassword(input.value)) {
            isValid = false;
            showError(input, "Password must be at least 8 characters long");
          }
          break;
      }
    }
  });

  return isValid;
}

// Add this function to update the summary
function updateSummary() {
  const selectedPlan = document.querySelector(".plan-card.selected");
  const isYearly = document.getElementById("billingToggle").checked;
  const selectedAddons = document.querySelectorAll(".add-on-card.selected");

  // Update plan details
  const planName = selectedPlan.querySelector("h3").textContent;
  const planPrice = selectedPlan.querySelector(".plan-price").textContent;
  const planTitle = document.querySelector(".selected-plan h3");
  const planCost = document.querySelector(".plan-cost");

  planTitle.textContent = `${planName} (${isYearly ? "Yearly" : "Monthly"})`;
  planCost.textContent = planPrice;

  // Update add-ons
  const addonsSummary = document.querySelector(".addons-summary");
  addonsSummary.innerHTML = "";

  let total = parseInt(planPrice.replace(/\D/g, ""));

  selectedAddons.forEach((addon) => {
    const name = addon.querySelector("h3").textContent;
    const price = addon.querySelector(".add-on-price").textContent;

    const addonItem = document.createElement("div");
    addonItem.className = "addon-item";
    addonItem.innerHTML = `
      <span class="addon-name">${name}</span>
      <span class="addon-cost">${price}</span>
    `;
    addonsSummary.appendChild(addonItem);

    total += parseInt(price.replace(/\D/g, ""));
  });

  // Update total
  const totalLabel = document.querySelector(".total-label");
  const totalCost = document.querySelector(".total-cost");

  totalLabel.textContent = `Total (per ${isYearly ? "year" : "month"})`;
  totalCost.textContent = `$${total}/${isYearly ? "yr" : "mo"}`;
}

// Add click handler for the Change button
document.querySelector(".change-btn").addEventListener("click", () => {
  current = 1; // Go back to plan selection
  showPage(current);
  updateProgress();
});

// Update the next button click handler to call updateSummary
nextBtns.forEach((button) => {
  button.addEventListener("click", function (e) {
    e.preventDefault();
    if (validateCurrentStep() && current < pages.length - 1) {
      current++;
      maxStepReached = Math.max(maxStepReached, current);
      showPage(current);
      updateProgress();
      if (current === 3) {
        // If moving to summary page
        updateSummary();
      }
    }
  });
});

prevBtns.forEach((button) => {
  button.addEventListener("click", function (e) {
    e.preventDefault();
    if (current > 0) {
      current--;
      showPage(current);
      updateProgress();
    }
  });
});

// Update or add the confirm button click handler
document.querySelector(".confirm-btn").addEventListener("click", function (e) {
  e.preventDefault();

  // Hide the form
  document.querySelector("#multiStepForm").style.display = "none";

  // Show thank you page
  const thankYouPage = document.querySelector(".thank-you-page");
  thankYouPage.style.display = "flex";

  // Update progress bar to show completion
  steps.forEach((step) => {
    const bullet = step.querySelector(".bullet");
    bullet.classList.add("active");
    step.classList.add("active");
  });
});

function initializePlanSelection() {
  const planCards = document.querySelectorAll(".plan-card");
  const billingToggle = document.getElementById("billingToggle");
  const monthlyPrices = { arcade: 9, advanced: 12, pro: 15 };
  const yearlyPrices = { arcade: 90, advanced: 120, pro: 150 };

  planCards.forEach((card) => {
    card.addEventListener("click", () => {
      // Remove selection from other cards
      planCards.forEach((c) => c.classList.remove("selected"));
      // Add selection to clicked card
      card.classList.add("selected");
    });
  });

  billingToggle.addEventListener("change", () => {
    const isYearly = billingToggle.checked;
    const yearlyBonuses = document.querySelectorAll(".yearly-bonus");
    const priceElements = document.querySelectorAll(".plan-price");
    const toggleOptions = document.querySelectorAll(".toggle-option");

    // Update prices and show/hide yearly bonus
    priceElements.forEach((el, index) => {
      const plan = planCards[index].dataset.plan;
      const price = isYearly ? yearlyPrices[plan] : monthlyPrices[plan];
      el.textContent = `$${price}/${isYearly ? "yr" : "mo"}`;
    });

    // Show/hide yearly bonus text
    yearlyBonuses.forEach((bonus) => {
      bonus.style.display = isYearly ? "block" : "none";
    });

    // Update toggle option active state
    toggleOptions[0].classList.toggle("active", !isYearly);
    toggleOptions[1].classList.toggle("active", isYearly);
  });
}

function initializeAddOns() {
  const addOnCards = document.querySelectorAll(".add-on-card");
  const checkboxes = document.querySelectorAll(
    '.checkbox-wrapper input[type="checkbox"]'
  );
  const monthlyPrices = { online: 1, storage: 2, profile: 2 };
  const yearlyPrices = { online: 10, storage: 20, profile: 20 };

  // Handle card selection
  addOnCards.forEach((card, index) => {
    card.addEventListener("click", () => {
      const checkbox = checkboxes[index];
      checkbox.checked = !checkbox.checked;
      card.classList.toggle("selected", checkbox.checked);
    });
  });

  // Update prices when billing period changes
  const billingToggle = document.getElementById("billingToggle");
  billingToggle.addEventListener("change", () => {
    const isYearly = billingToggle.checked;
    const priceElements = document.querySelectorAll(".add-on-price");

    priceElements.forEach((el, index) => {
      const addOnId = checkboxes[index].id;
      const price = isYearly ? yearlyPrices[addOnId] : monthlyPrices[addOnId];
      el.textContent = `+$${price}/${isYearly ? "yr" : "mo"}`;
    });
  });
}

// Call this function after your page load
document.addEventListener("DOMContentLoaded", () => {
  initializePlanSelection();
  initializeAddOns();
});
