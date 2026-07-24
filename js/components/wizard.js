export class CMPWizard {

  constructor() {

    this.currentStep = 0;

    this.pages = document.querySelectorAll(".wizard-page");
    this.steps = document.querySelectorAll(".wizard-step");

    this.prevBtn = document.getElementById("prevBtn");
    this.nextBtn = document.getElementById("nextBtn");
    this.submitBtn = document.getElementById("submitBtn");

    this.showStep(this.currentStep);

    this.attachEvents();

  }

  attachEvents() {

    this.nextBtn?.addEventListener("click", () => {

  if (!this.validateCurrentStep()) {
    return;
  }

  if (this.currentStep < this.pages.length - 1) {

    this.currentStep++;

    this.showStep(this.currentStep);

  }

});

    this.prevBtn?.addEventListener("click", () => {

      if (this.currentStep > 0) {

        this.currentStep--;

        this.showStep(this.currentStep);

      }

    });

  }

  showStep(index) {

    this.pages.forEach(page => page.classList.remove("active"));

    this.steps.forEach(step => step.classList.remove("active"));
    
    const icons = document.querySelectorAll(".step-number");

icons.forEach((icon, i) => {

  if (i < index) {

    icon.textContent = "✓";

  } else {

    icon.textContent = icon.dataset.icon;

  }

});

    this.pages[index].classList.add("active");

    this.steps[index].classList.add("active");

    this.prevBtn.style.visibility =
      index === 0 ? "hidden" : "visible";

    if (index === this.pages.length - 1) {

      this.nextBtn.style.display = "none";
      this.submitBtn.style.display = "inline-block";

    } else {

      this.nextBtn.style.display = "inline-block";
      this.submitBtn.style.display = "none";

    }

  }
  
  validateCurrentStep() {

  const currentPage = this.pages[this.currentStep];

  currentPage
    .querySelectorAll(".error-text")
    .forEach(error => error.remove());

  currentPage
    .querySelectorAll(".field-error")
    .forEach(field => field.classList.remove("field-error"));

  const requiredFields =
    currentPage.querySelectorAll("[required]");

  for (const field of requiredFields) {

    if (!field.value.trim()) {

      field.classList.add("field-error");

      const error =
        document.createElement("small");

      error.className = "error-text";

      error.textContent =
        "This field is required.";

      field.insertAdjacentElement(
        "afterend",
        error
      );

      field.focus();

      return false;

    }

  }

  return true;

}

}

