import fs from "fs";

const file = "functions/index.js";
const source = fs.readFileSync(file, "utf8");

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
        !/cooperatives\.push\(\{[\s\S]*administratorEmail/.test(source)
    ],
    [
        "NO_ADMINISTRATOR_UID_EXPOSED",
        !/cooperatives\.push\(\{[\s\S]*administratorUid/.test(source)
    ],
    [
        "NO_OFFICIAL_PHONE_EXPOSED",
        !/cooperatives\.push\(\{[\s\S]*officialPhone/.test(source)
    ],
    [
        "NO_SUBSCRIPTION_PLAN_EXPOSED",
        !/cooperatives\.push\(\{[\s\S]*subscriptionPlan/.test(source)
    ],
    [
        "NO_DIRECT_CLIENT_DISCOVERY_IN_FUNCTION",
        !/getActiveCooperatives[\s\S]*firebase\/firestore/.test(source)
    ],
    [
        "ORIGINAL_SUBMIT_CALLABLE_REMAINS",
        /exports\.submitCooperativeApplication\s*=\s*onCall/
    ]
];

let failed = false;

for (const [name, check] of checks) {
    const passed =
        typeof check === "boolean"
            ? check
            : check.test(source);

    console.log(
        `${name}: ${passed ? "PASS" : "FAIL"}`
    );

    if (!passed) {
        failed = true;
    }
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
