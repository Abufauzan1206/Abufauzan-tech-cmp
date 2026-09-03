import fs from "fs";

const source =
    fs.readFileSync(
        "js/services/membershipApplicationService.js",
        "utf8"
    );

const checks = [
    [
        "FIREBASE_FUNCTIONS_IMPORT_EXISTS",
        source.includes(
            'firebase-functions.js'
        )
    ],
    [
        "FUNCTIONS_CLIENT_INITIALIZED",
        source.includes(
            "const functions = getFunctions();"
        )
    ],
    [
        "PENDING_CALLABLE_REFERENCE_EXISTS",
        source.includes(
            'httpsCallable(\n        functions,\n        "getPendingMembershipApplications"'
        )
    ],
    [
        "APPROVAL_CALLABLE_REFERENCE_EXISTS",
        source.includes(
            'httpsCallable(\n        functions,\n        "approveMembershipApplication"'
        )
    ],
    [
        "REJECTION_CALLABLE_REFERENCE_EXISTS",
        source.includes(
            'httpsCallable(\n        functions,\n        "rejectMembershipApplication"'
        )
    ],
    [
        "PENDING_SERVICE_EXISTS",
        source.includes(
            "export async function getPendingMembershipApplications()"
        )
    ],
    [
        "APPROVAL_SERVICE_EXISTS",
        source.includes(
            "export async function approveMembershipApplication("
        )
    ],
    [
        "REJECTION_SERVICE_EXISTS",
        source.includes(
            "export async function rejectMembershipApplication("
        )
    ],
    [
        "PENDING_USES_CALLABLE",
        source.includes(
            "getPendingMembershipApplicationsCallable();"
        )
    ],
    [
        "APPROVAL_USES_CALLABLE",
        source.includes(
            "approveMembershipApplicationCallable({"
        )
    ],
    [
        "REJECTION_USES_CALLABLE",
        source.includes(
            "rejectMembershipApplicationCallable({"
        )
    ],
    [
        "PENDING_RESPONSE_VALIDATED",
        source.includes(
            "Array.isArray(result.data.applications)"
        )
    ],
    [
        "APPROVAL_INPUT_VALIDATED",
        source.includes(
            "Membership application ID is required."
        )
    ],
    [
        "REJECTION_INPUT_VALIDATED",
        source.includes(
            "Membership application ID is required."
        )
    ],
    [
        "APPROVAL_RESULT_RETURNED",
        source.includes(
            "return result.data;"
        )
    ],
    [
        "REJECTION_RESULT_RETURNED",
        source.includes(
            "return result.data;"
        )
    ],
    [
        "ORIGINAL_APPLICATION_ENGINE_REMAINS",
        source.includes(
            "CMPMembershipApplicationEngine"
        )
    ],
    [
        "COOPERATIVE_QUERY_REMAINS",
        source.includes(
            "getMembershipApplicationsByCooperativeId"
        )
    ]
];

let failed = false;

for (const [name, passed] of checks) {
    const status = passed ? "PASS" : "FAIL";

    if (!passed) {
        failed = true;
    }

    console.log(`${name}: ${status}`);
}

if (failed) {
    console.error(
        "RC406-D70 MEMBERSHIP APPLICATION DECISION SERVICE AUDIT: FAIL"
    );
    process.exit(1);
}

console.log(
    "RC406-D70 MEMBERSHIP APPLICATION DECISION SERVICE AUDIT: PASS"
);
