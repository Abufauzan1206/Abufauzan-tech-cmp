import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "modules/membership-application/index.html",
        mode: "create",
        replace: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Apply for Membership</title>
    <link rel="stylesheet" href="./style.css">
</head>
<body>
    <main id="membershipApplication">
        <h1>Apply for Membership</h1>

        <p>
            Complete the form below to submit your membership application.
            Your application will remain pending until reviewed by the
            cooperative.
        </p>

        <form id="membershipApplicationForm" novalidate>

            <h2>Personal Information</h2>

            <label>
                First Name
                <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                >
            </label>

            <label>
                Middle Name
                <input
                    type="text"
                    id="middleName"
                    name="middleName"
                >
            </label>

            <label>
                Last Name
                <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                >
            </label>

            <label>
                Phone Number
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                >
            </label>

            <label>
                Email
                <input
                    type="email"
                    id="email"
                    name="email"
                >
            </label>

            <h2>Cooperative</h2>

            <label>
                Cooperative
                <select
                    id="cooperativeId"
                    name="cooperativeId"
                    required
                >
                    <option value="">
                        Select Cooperative
                    </option>
                </select>
            </label>

            <p id="cooperativeMessage"></p>

            <button type="submit">
                Submit Membership Application
            </button>

        </form>

        <p id="applicationMessage"></p>
    </main>

    <script type="module" src="./app.js"></script>
</body>
</html>`
    },

    {
        path: "modules/membership-application/style.css",
        mode: "create",
        replace: `#membershipApplication {
    max-width: 720px;
    margin: 40px auto;
    padding: 24px;
}

#membershipApplication form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

#membershipApplication label {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

#membershipApplication input,
#membershipApplication select {
    padding: 10px;
}

#membershipApplication button {
    padding: 12px 18px;
    cursor: pointer;
}

#applicationMessage,
#cooperativeMessage {
    min-height: 20px;
}`
    },

    {
        path: "modules/membership-application/app.js",
        mode: "create",
        replace: `import { submitMembershipApplication } from "../../js/services/membershipApplicationService.js";

const form = document.getElementById(
    "membershipApplicationForm"
);

const applicationMessage = document.getElementById(
    "applicationMessage"
);

const cooperativeMessage = document.getElementById(
    "cooperativeMessage"
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

/*
 * RC406-D63
 *
 * Cooperative discovery is intentionally NOT performed by
 * querying Firestore directly from this public page.
 *
 * A public cooperative-discovery boundary will be supplied
 * by the backend/security layer.
 */
if (cooperativeMessage) {
    cooperativeMessage.textContent =
        "Cooperative selection will be loaded through the public cooperative discovery service.";
}

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
});`
    }
];

const result = await transaction(patches);

console.log("PATCH ENGINE RESULT:");
console.log(JSON.stringify(result, null, 2));

if (!result.success) {
    process.exitCode = 1;
    throw new Error(
        "RC406-D63 PUBLIC MEMBERSHIP APPLICATION BOUNDARY: FAIL"
    );
}

console.log(
    "RC406-D63 PUBLIC MEMBERSHIP APPLICATION BOUNDARY: PASS"
);
