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
  const errorDiv =
    field.querySelector(".error-message") || document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.textContent = message;

  if (!field.querySelector(".error-message")) {
    field.appendChild(errorDiv);
  }

  input.classList.add("error");
}

function clearError(input) {
  const field = input.closest(".field");
  const errorDiv = field.querySelector(".error-message");
  if (errorDiv) {
    errorDiv.remove();
  }
  input.classList.remove("error");
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  return /^\d{10}$/.test(phone);
}

function validatePassword(password) {
  return password.length >= 8;
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
        case "email":
          if (!validateEmail(input.value)) {
            isValid = false;
            showError(input, "Please enter a valid email address");
          }
          break;
        case "tel":
          if (!validatePhone(input.value)) {
            isValid = false;
            showError(input, "Please enter a valid 10-digit phone number");
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

nextBtns.forEach((button) => {
  button.addEventListener("click", function (e) {
    e.preventDefault();
    if (validateCurrentStep() && current < pages.length - 1) {
      current++;
      maxStepReached = Math.max(maxStepReached, current);
      showPage(current);
      updateProgress();
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

submitBtn.addEventListener("click", function (e) {
  e.preventDefault();
  if (validateCurrentStep()) {
    const formSide = document.querySelector(".form-side");
    formSide.innerHTML = `
      <div class="success-message">
        <h2>Thank You!</h2>
        <p>Your registration has been successfully completed.</p>
        <button onclick="location.reload()">Start Over</button>
      </div>
    `;
  }
});
