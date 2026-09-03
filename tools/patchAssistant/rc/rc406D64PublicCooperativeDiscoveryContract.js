import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "js/services/cooperativeDiscoveryService.js",
        mode: "create",
        replace: `import {
    getFunctions,
    httpsCallable
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-functions.js";

const functions = getFunctions();

const getActiveCooperativesCallable = httpsCallable(
    functions,
    "getActiveCooperatives"
);

/**
 * Public cooperative discovery boundary.
 *
 * The client does not read the cooperatives collection
 * directly. The backend is responsible for exposing only
 * cooperatives that are eligible for public membership
 * applications.
 */
export async function getActiveCooperatives() {
    const result =
        await getActiveCooperativesCallable();

    if (!result?.data?.success) {
        throw new Error(
            result?.data?.message ||
            "Unable to load active cooperatives."
        );
    }

    if (!Array.isArray(result.data.cooperatives)) {
        throw new Error(
            "Invalid cooperative discovery response."
        );
    }

    return result.data.cooperatives;
}`
    },

    {
        path: "modules/membership-application/app.js",
        search: `import { submitMembershipApplication } from "../../js/services/membershipApplicationService.js";`,
        replace: `import { submitMembershipApplication } from "../../js/services/membershipApplicationService.js";
import { getActiveCooperatives } from "../../js/services/cooperativeDiscoveryService.js";`
    },

    {
        path: "modules/membership-application/app.js",
        search: `const cooperativeMessage = document.getElementById(
    "cooperativeMessage"
);`,
        replace: `const cooperativeMessage = document.getElementById(
    "cooperativeMessage"
);

const cooperativeSelect = document.getElementById(
    "cooperativeId"
);`
    },

    {
        path: "modules/membership-application/app.js",
        search: `/*
 * RC406-D63

 * Cooperative discovery is intentionally NOT performed by
 * querying Firestore directly from this public page.
 *
 * A public cooperative-discovery boundary will be supplied
 * by the backend/security layer.
 */
if (cooperativeMessage) {
    cooperativeMessage.textContent =
        "Cooperative selection will be loaded through the public cooperative discovery service.";
}`,
        replace: `async function loadActiveCooperatives() {
    if (!cooperativeSelect) {
        return;
    }

    try {
        const cooperatives =
            await getActiveCooperatives();

        cooperativeSelect.innerHTML =
            '<option value="">Select Cooperative</option>';

        cooperatives.forEach((cooperative) => {
            if (
                typeof cooperative?.cooperativeId !==
                    "string" ||
                typeof cooperative?.cooperativeName !==
                    "string"
            ) {
                return;
            }

            const option =
                document.createElement("option");

            option.value =
                cooperative.cooperativeId.trim();

            option.textContent =
                cooperative.cooperativeName.trim();

            cooperativeSelect.appendChild(option);
        });

        if (cooperativeMessage) {
            cooperativeMessage.textContent =
                cooperatives.length
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

loadActiveCooperatives();`
    }
];

const result = await transaction(patches);

console.log("PATCH ENGINE RESULT:");
console.log(JSON.stringify(result, null, 2));

if (!result.success) {
    process.exitCode = 1;
    throw new Error(
        "RC406-D64 PUBLIC COOPERATIVE DISCOVERY CONTRACT: FAIL"
    );
}

console.log(
    "RC406-D64 PUBLIC COOPERATIVE DISCOVERY CONTRACT: PASS"
);
