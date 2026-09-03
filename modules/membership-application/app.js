import { submitMembershipApplication } from "../../js/services/membershipApplicationService.js";
import { getActiveCooperatives } from "../../js/services/cooperativeDiscoveryService.js";

const form = document.getElementById(
    "membershipApplicationForm"
);

const applicationMessage = document.getElementById(
    "applicationMessage"
);

const cooperativeMessage = document.getElementById(
    "cooperativeMessage"
);

const cooperativeSelect = document.getElementById(
    "cooperativeId"
);

function showMessage(message) {
    if (applicationMessage) {
        applicationMessage.textContent = message;
    }
}

function getFormData() {
    const formData = new FormData(form);

    return {
        firstName: String(
            formData.get("firstName") ?? ""
        ).trim(),

        middleName: String(
            formData.get("middleName") ?? ""
        ).trim(),

        lastName: String(
            formData.get("lastName") ?? ""
        ).trim(),

        phone: String(
            formData.get("phone") ?? ""
        ).trim(),

        email: String(
            formData.get("email") ?? ""
        ).trim(),

        cooperativeId: String(
            formData.get("cooperativeId") ?? ""
        ).trim()
    };
}

function validateApplication(data) {
    if (!data.firstName) {
        throw new Error("First name is required.");
    }

    if (!data.lastName) {
        throw new Error("Last name is required.");
    }

    if (!data.phone) {
        throw new Error("Phone number is required.");
    }

    if (!data.cooperativeId) {
        throw new Error("Please select a cooperative.");
    }

    return true;
}

async function loadActiveCooperatives() {
    if (!cooperativeSelect) {
        return;
    }

    try {
        const cooperatives = await getActiveCooperatives();

        cooperativeSelect.innerHTML =
            '<option value="">Select Cooperative</option>';

        cooperatives.forEach((cooperative) => {
            if (
                typeof cooperative?.cooperativeId !== "string" ||
                typeof cooperative?.cooperativeName !== "string"
            ) {
                return;
            }

            const option = document.createElement("option");
            option.value = cooperative.cooperativeId.trim();
            option.textContent = cooperative.cooperativeName.trim();

            cooperativeSelect.appendChild(option);
        });

        if (cooperativeMessage) {
            cooperativeMessage.textContent = cooperatives.length
                ? "Select your cooperative."
                : "No active cooperatives are currently available.";
        }
    } catch (error) {
        if (cooperativeMessage) {
            cooperativeMessage.textContent =
                error?.message ||
                "Unable to load cooperatives.";
        }
    }
}

loadActiveCooperatives();

form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
        const data = getFormData();

        validateApplication(data);

        const result =
            await submitMembershipApplication(data);

        showMessage(
            result?.applicationId
                ? "Application submitted successfully. Application ID: " +
                  result.applicationId
                : "Membership application submitted successfully."
        );

        form.reset();
    } catch (error) {
        showMessage(
            error?.message ||
            "Unable to submit membership application."
        );
    }
});