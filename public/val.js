class ZipCodeValidator {
  constructor() {
    this.baseUrl = "https://api.zippopotam.us/us/";
    this.cache = new Map();
  }

  async validate(zipCode) {
    // Check cache first
    if (this.cache.has(zipCode)) {
      return this.cache.get(zipCode);
    }

    try {
      const response = await fetch(`${this.baseUrl}${zipCode}`);

      if (!response.ok) {
        throw new Error("Invalid ZIP code");
      }

      const data = await response.json();
      const result = {
        valid: true,
        city: data.places[0]["place name"],
        state: data.places[0]["state abbreviation"],
      };

      // Cache the result
      this.cache.set(zipCode, result);
      return result;
    } catch (error) {
      return {
        valid: false,
        error: "Please enter a valid US ZIP code",
      };
    }
  }
}

class FormValidator {
  constructor(formId) {
    this.form = document.getElementById(formId);
    this.modal = document.getElementById("validationModal");
    this.modalMessage = document.getElementById("modalMessage");
    this.spinner = this.form.querySelector(".spinner");
    this.buttonText = this.form.querySelector(".button-text");
    this.zipValidator = new ZipCodeValidator();

    this.validationRules = {
      email: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Please enter a valid email address",
      },
      first_name: {
        pattern: /^[a-zA-Z\s]{2,}$/,
        message:
          "Please enter a valid first name (at least 2 characters, letters only)",
      },
      last_name: {
        pattern: /^[a-zA-Z\s]{2,}$/,
        message:
          "Please enter a valid last name (at least 2 characters, letters only)",
      },
      zipcode: {
        pattern: /^\d{5}(-\d{4})?$/,
        message: "Please enter a valid ZIP code (e.g., 12345 or 12345-6789)",
      },
    };

    this.setupEventListeners();
    this.setupRealTimeValidation();
  }

  setupEventListeners() {
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));

    // Modal close handlers
    document
      .querySelector(".close")
      .addEventListener("click", () => this.closeModal());
    window.addEventListener("click", (e) => {
      if (e.target === this.modal) this.closeModal();
    });
  }

  setupRealTimeValidation() {
    Object.keys(this.validationRules).forEach((fieldName) => {
      const input = this.form[fieldName];
      const validationIcon =
        input.parentElement.querySelector(".validation-icon");

      input.addEventListener("input", () => {
        const isValid = this.validateField(fieldName, input.value);
        this.updateValidationUI(input, isValid);
        validationIcon.style.display = "block";
        validationIcon.className =
          "validation-icon " + (isValid ? "valid" : "invalid");
      });

      input.addEventListener("focus", () => {
        const errorElement = document.getElementById(`${fieldName}Error`);
        errorElement.style.display = "block";
        errorElement.textContent = this.validationRules[fieldName].message;
      });

      input.addEventListener("blur", () => {
        const isValid = this.validateField(fieldName, input.value);
        if (isValid) {
          document.getElementById(`${fieldName}Error`).style.display = "none";
        }
      });
    });
  }

  validateField(fieldName, value) {
    return this.validationRules[fieldName].pattern.test(value);
  }

  updateValidationUI(input, isValid) {
    const errorElement = document.getElementById(`${input.name}Error`);
    if (!isValid) {
      errorElement.style.display = "block";
      errorElement.textContent = this.validationRules[input.name].message;
      input.style.borderColor = "var(--error-color)";
    } else {
      errorElement.style.display = "none";
      input.style.borderColor = "var(--primary-color)";
    }
  }

  async handleSubmit(e) {
    e.preventDefault();

    // Validate all fields
    let isValid = true;
    Object.keys(this.validationRules).forEach((fieldName) => {
      const input = this.form[fieldName];
      const fieldIsValid = this.validateField(fieldName, input.value);
      this.updateValidationUI(input, fieldIsValid);
      if (!fieldIsValid) isValid = false;
    });

    if (!isValid) return;

    // Show loading state
    this.setLoadingState(true);

    try {
      const zipCode = this.form.zipcode.value.substring(0, 5);

      // Validate ZIP code with API
      const zipValidation = await this.zipValidator.validate(zipCode);

      if (zipValidation.valid) {
        // Submit the form to SFMC
        this.form.submit();
      } else {
        this.showModal(zipValidation.error, false);
        this.setLoadingState(false);
      }
    } catch (error) {
      this.showModal(
        "An error occurred while validating your ZIP code. Please try again.",
        false
      );
      this.setLoadingState(false);
    }
  }

  setLoadingState(loading) {
    this.spinner.style.display = loading ? "block" : "none";
    this.buttonText.style.display = loading ? "none" : "block";
    this.form.querySelector("button").disabled = loading;
  }

  showModal(message, success) {
    this.modalMessage.textContent = message;
    this.modalMessage.className = success ? "success-message" : "error-message";
    this.modal.style.display = "block";
    setTimeout(() => this.modal.classList.add("show"), 10);
  }

  closeModal() {
    this.modal.classList.remove("show");
    setTimeout(() => (this.modal.style.display = "none"), 300);
  }
}

// Initialize form validator
new FormValidator("SFMC_Form");
