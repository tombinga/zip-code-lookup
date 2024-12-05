// Create and append modal to body if it doesn't exist
function createModal() {
  if (!document.getElementById("validationModal")) {
    const modalHtml = `
            <div id="validationModal" class="modal">
                <div class="modal-content">
                    <h4>Validation Error</h4>
                    <p id="modalMessage"></p>
                    <button class="btn btn-primary" onclick="closeModal()">Close</button>
                </div>
            </div>
        `;

    // Add modal styles
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
            .modal {
                display: none;
                position: fixed;
                z-index: 1000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.4);
            }
            .modal.show {
                display: block;
            }
            .modal-content {
                background-color: #fefefe;
                margin: 15% auto;
                padding: 20px;
                border: 1px solid #888;
                width: 80%;
                max-width: 500px;
            }
        `;
    document.head.appendChild(styleSheet);

    // Add modal to body
    const modalDiv = document.createElement("div");
    modalDiv.innerHTML = modalHtml;
    document.body.appendChild(modalDiv.firstElementChild);
  }
}

// Modal close function
window.closeModal = function () {
  document.getElementById("validationModal").classList.remove("show");
};

class ZipCodeValidator {
  constructor() {
    this.baseUrl = "https://api.zippopotam.us/us/";
    this.cache = new Map();
  }

  async validate(zipCode) {
    // Extract the base 5-digit zip code
    const baseZip = zipCode.split("-")[0].trim();

    // Validate format
    if (!/^\d{5}(-\d{4})?$/.test(zipCode)) {
      return {
        valid: false,
        error: "Please enter a valid US ZIP code (12345 or 12345-1234)",
      };
    }

    // Check cache using base zip
    if (this.cache.has(baseZip)) {
      return this.cache.get(baseZip);
    }

    try {
      const response = await fetch(`${this.baseUrl}${baseZip}`);
      if (!response.ok) {
        throw new Error("Invalid ZIP code");
      }

      const data = await response.json();
      const result = {
        valid: true,
        city: data.places[0]["place name"],
        state: data.places[0]["state abbreviation"],
      };

      // Cache using base zip
      this.cache.set(baseZip, result);
      return result;
    } catch (error) {
      return {
        valid: false,
        error: "Please enter a valid US ZIP code (12345 or 12345-1234)",
      };
    }
  }
}

// Initialize form validation when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Create modal
  createModal();

  // Initialize validator
  const zipValidator = new ZipCodeValidator();
  const form = document.getElementById("SFMC_Form");
  const modal = document.getElementById("validationModal");
  const modalMessage = document.getElementById("modalMessage");

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Get zip code value
      const zipCode = form.querySelector('[name="zipcode"]').value;
      const validationResult = await zipValidator.validate(zipCode);

      if (!validationResult.valid) {
        modalMessage.textContent = validationResult.error;
        modal.classList.add("show");
        return;
      }

      // If validation passes, submit the form
      form.submit();
    });
  }
});
