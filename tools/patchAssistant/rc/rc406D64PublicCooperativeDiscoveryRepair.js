import { transaction } from "../patchEngine.js";

const patches = [
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
}`,
        replace: `async function loadActiveCooperatives() {
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

loadActiveCooperatives();`
    }
];

const result = await transaction(patches);

console.log("PATCH ENGINE RESULT:");
console.log(JSON.stringify(result, null, 2));

if (!result.success) {
    process.exitCode = 1;
    throw new Error(
        "RC406-D64 PUBLIC COOPERATIVE DISCOVERY REPAIR: FAIL"
    );
}

console.log(
    "RC406-D64 PUBLIC COOPERATIVE DISCOVERY REPAIR: PASS"
);
