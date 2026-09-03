import fs from "fs";

const file = "functions/index.js";
const source = fs.readFileSync(file, "utf8");

const startMarker =
    "exports.getActiveCooperatives = onCall(async () => {";

const endMarker =
    "exports.submitCooperativeApplication = onCall(async (request) => {";

const start = source.indexOf(startMarker);
const end = source.indexOf(endMarker);

if (start === -1 || end === -1 || end <= start) {
    throw new Error(
        "Unable to isolate RC406-D65 callable."
    );
}

const d65 = source.slice(start, end);

const checks = [
    [
        "CALLABLE_EXISTS",
        /exports\.getActiveCooperatives\s*=\s*onCall/
    ],
    [
        "ACTIVE_STATUS_FILTER_EXISTS",
        /\.where\(\s*["']status["']\s*,\s*["']==["']\s*,\s*["']active["']\s*\)/
    ],
    [
        "USES_COOPERATIVES_COLLECTION",
        /\.collection\(\s*["']cooperatives["']\s*\)/
    ],
    [
        "RETURNS_SUCCESS",
        /success:\s*true/
    ],
    [
        "RETURNS_COOPERATIVES_ARRAY",
        /cooperatives\s*=\s*\[\]/
    ],
    [
        "RETURNS_COOPERATIVE_ID",
        /cooperativeId:\s*data\.cooperativeId\.trim\(\)/
    ],
    [
        "RETURNS_COOPERATIVE_NAME",
        /cooperativeName:\s*data\.cooperativeName\.trim\(\)/
    ],
    [
        "INVALID_RECORDS_SKIPPED",
        /typeof data\.cooperativeId !== "string"[\s\S]*typeof data\.cooperativeName !== "string"[\s\S]*return;/
    ],
    [
        "PUBLIC_RESPONSE_MINIMIZED",
        /cooperatives\.push\(\{[\s\S]*cooperativeId:[\s\S]*cooperativeName:[\s\S]*\}\)/
    ],
    [
        "NO_ADMINISTRATOR_EMAIL_EXPOSED",
        !/administratorEmail/.test(d65)
    ],
    [
        "NO_ADMINISTRATOR_UID_EXPOSED",
        !/administratorUid/.test(d65)
    ],
    [
        "NO_OFFICIAL_PHONE_EXPOSED",
        !/officialPhone/.test(d65)
    ],
    [
        "NO_SUBSCRIPTION_PLAN_EXPOSED",
        !/subscriptionPlan/.test(d65)
    ],
    [
        "NO_DIRECT_FIRESTORE_CLIENT_ACCESS",
        !/firebase\/firestore/.test(d65)
    ]
];

let failed = false;

for (const [name, check] of checks) {
    const passed =
        typeof check === "boolean"
            ? check
            : check.test(d65);

    console.log(
        `${name}: ${passed ? "PASS" : "FAIL"}`
    );

    if (!passed) {
        failed = true;
    }
}

const originalSubmitRemains =
    /exports\.submitCooperativeApplication\s*=\s*onCall/.test(
        source
    );

console.log(
    `ORIGINAL_SUBMIT_CALLABLE_REMAINS: ${
        originalSubmitRemains ? "PASS" : "FAIL"
    }`
);

if (!originalSubmitRemains) {
    failed = true;
}

if (failed) {
    process.exitCode = 1;
    throw new Error(
        "RC406-D65 BACKEND COOPERATIVE DISCOVERY AUDIT: FAIL"
    );
}

console.log(
    "RC406-D65 BACKEND COOPERATIVE DISCOVERY AUDIT: PASS"
);
