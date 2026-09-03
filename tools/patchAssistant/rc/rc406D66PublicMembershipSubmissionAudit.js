import fs from "fs";

const file = "functions/index.js";
const source = fs.readFileSync(file, "utf8");

const startMarker =
    "exports.submitMembershipApplication = onCall(async (request) => {";

const endMarker =
    "exports.submitCooperativeApplication = onCall(async (request) => {";

const start = source.indexOf(startMarker);
const end = source.indexOf(endMarker);

if (start === -1 || end === -1 || end <= start) {
    throw new Error(
        "Unable to isolate RC406-D66 callable."
    );
}

const d66 = source.slice(start, end);

const checks = [
    [
        "CALLABLE_EXISTS",
        /exports\.submitMembershipApplication\s*=\s*onCall/
    ],
    [
        "REQUEST_DATA_READ",
        /const data = request\?\.data \|\| \{\};/
    ],
    [
        "FIRST_NAME_NORMALIZED",
        /const firstName[\s\S]*typeof data\.firstName === "string"[\s\S]*data\.firstName\.trim\(\)/
    ],
    [
        "LAST_NAME_NORMALIZED",
        /const lastName[\s\S]*typeof data\.lastName === "string"[\s\S]*data\.lastName\.trim\(\)/
    ],
    [
        "PHONE_NORMALIZED",
        /const phone[\s\S]*typeof data\.phone === "string"[\s\S]*data\.phone\.trim\(\)/
    ],
    [
        "EMAIL_NORMALIZED",
        /const email[\s\S]*typeof data\.email === "string"[\s\S]*data\.email\.trim\(\)\.toLowerCase\(\)/
    ],
    [
        "COOPERATIVE_ID_NORMALIZED",
        /const cooperativeId[\s\S]*typeof data\.cooperativeId === "string"[\s\S]*data\.cooperativeId\.trim\(\)/
    ],
    [
        "FIRST_NAME_REQUIRED",
        /if \(!firstName\)[\s\S]*First name is required/
    ],
    [
        "LAST_NAME_REQUIRED",
        /if \(!lastName\)[\s\S]*Last name is required/
    ],
    [
        "PHONE_REQUIRED",
        /if \(!phone\)[\s\S]*Phone number is required/
    ],
    [
        "COOPERATIVE_ID_REQUIRED",
        /if \(!cooperativeId\)[\s\S]*Cooperative ID is required/
    ],
    [
        "COOPERATIVE_LOOKUP_EXISTS",
        /db\.collection\("cooperatives"\)\.doc\(cooperativeId\)/
    ],
    [
        "COOPERATIVE_MUST_EXIST",
        /if \(!cooperativeSnapshot\.exists\)/
    ],
    [
        "ACTIVE_STATUS_REQUIRED",
        /cooperative\?\.status !== "active"/
    ],
    [
        "REJECTS_INACTIVE_COOPERATIVE",
        /Selected cooperative is not accepting membership applications/
    ],
    [
        "APPLICATION_COLLECTION_USED",
        /db\.collection\("membershipApplications"\)\.doc\(\)/
    ],
    [
        "APPLICATION_ID_CREATED",
        /const applicationId\s*=\s*applicationRef\.id/
    ],
    [
        "PENDING_STATUS_FORCED",
        /status:\s*"pending"/
    ],
    [
        "SUBMITTED_AT_CREATED",
        /submittedAt:\s*FieldValue\.serverTimestamp\(\)/
    ],
    [
        "APPLICATION_PERSISTED",
        /await applicationRef\.set\(\{/
    ],
    [
        "SUCCESS_RESPONSE_EXISTS",
        /success:\s*true[\s\S]*applicationId/
    ],
    [
        "NO_MEMBER_COLLECTION_WRITE",
        !/db\.collection\("members"\)/.test(d66)
    ],
    [
        "NO_MEMBER_ENGINE_USAGE",
        !/CMPMemberEngine/.test(d66)
    ],
    [
        "NO_ADMINISTRATOR_FIELDS",
        !/administrator(?:Email|Uid|Name)/.test(d66)
    ],
    [
        "NO_SUBSCRIPTION_FIELD",
        !/subscriptionPlan/.test(d66)
    ],
    [
        "NO_ARBITRARY_INPUT_SPREAD",
        !/\.\.\.data/.test(d66)
    ],
    [
        "ORIGINAL_COOPERATIVE_SUBMISSION_REMAINS",
        /exports\.submitCooperativeApplication\s*=\s*onCall/.test(source)
    ]
];

let failed = false;

for (const [name, check] of checks) {
    const passed =
        typeof check === "boolean"
            ? check
            : check.test(d66);

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
        "RC406-D66 PUBLIC MEMBERSHIP SUBMISSION AUDIT: FAIL"
    );
}

console.log(
    "RC406-D66 PUBLIC MEMBERSHIP SUBMISSION AUDIT: PASS"
);
