import fs from "fs";

const file =
    "js/services/membershipApplicationService.js";

const source = fs.readFileSync(file, "utf8");

const checks = [
    [
        "APPLICATION_ENGINE_IMPORT_REMAINS",
        /import\s*\{\s*CMPMembershipApplicationEngine\s*\}[\s\S]*from\s*"\.\.\/business\/membershipApplicationEngine\.js";/
    ],
    [
        "FIREBASE_FUNCTIONS_IMPORT_EXISTS",
        /getFunctions[\s\S]*httpsCallable/
    ],
    [
        "FIREBASE_FUNCTIONS_MODULE_CORRECT",
        /https:\/\/www\.gstatic\.com\/firebase\/12\.0\.0\/firebase-functions\.js/
    ],
    [
        "FUNCTIONS_CLIENT_INITIALIZED",
        /const functions\s*=\s*getFunctions\(\);/
    ],
    [
        "CALLABLE_REFERENCE_EXISTS",
        /const submitMembershipApplicationCallable[\s\S]*httpsCallable\([\s\S]*"submitMembershipApplication"/
    ],
    [
        "SUBMISSION_SERVICE_EXISTS",
        /export async function submitMembershipApplication\(data\)/
    ],
    [
        "SUBMISSION_INPUT_VALIDATED",
        /if\s*\(!data\s*\|\|\s*typeof data !== "object"\)/
    ],
    [
        "SUBMISSION_USES_CALLABLE",
        /await submitMembershipApplicationCallable\(data\)/
    ],
    [
        "CALLABLE_SUCCESS_CHECK",
        /if\s*\(!result\?\.data\?\.success\)/
    ],
    [
        "CALLABLE_ERROR_MESSAGE",
        /result\?\.data\?\.message/
    ],
    [
        "CALLABLE_RESULT_RETURNED",
        /return result\.data;/
    ],
    [
        "NO_DIRECT_ENGINE_SUBMISSION",
        !/CMPMembershipApplicationEngine\.submit\(data\)/.test(source)
    ],
    [
        "GET_BY_ID_SERVICE_REMAINS",
        /export async function getMembershipApplicationById\(applicationId\)/
    ],
    [
        "GET_BY_ID_ENGINE_REMAINS",
        /CMPMembershipApplicationEngine\.getById\(\s*applicationId\s*\)/
    ],
    [
        "GET_ALL_SERVICE_REMAINS",
        /export async function getMembershipApplications\(\)/
    ],
    [
        "GET_ALL_ENGINE_REMAINS",
        /CMPMembershipApplicationEngine\.getAll\(\)/
    ],
    [
        "COOPERATIVE_QUERY_SERVICE_REMAINS",
        /export async function getMembershipApplicationsByCooperativeId\(\s*cooperativeId\s*\)/
    ],
    [
        "COOPERATIVE_QUERY_ENGINE_REMAINS",
        /\.getByCooperativeId\(\s*cooperativeId\s*\)/
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
        "RC406-D67 PUBLIC MEMBERSHIP SUBMISSION SERVICE AUDIT: FAIL"
    );
}

console.log(
    "RC406-D67 PUBLIC MEMBERSHIP SUBMISSION SERVICE AUDIT: PASS"
);
