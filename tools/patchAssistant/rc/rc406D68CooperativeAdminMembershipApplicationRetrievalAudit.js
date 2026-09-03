import fs from "fs";

const file = "functions/index.js";
const source = fs.readFileSync(file, "utf8");

const start =
    source.indexOf(
        "exports.getPendingMembershipApplications = onCall(async (request) => {"
    );

const end =
    source.indexOf(
        "exports.submitMembershipApplication = onCall(async (request) => {",
        start
    );

if (start === -1 || end === -1) {
    throw new Error(
        "RC406-D68 AUDIT: Unable to isolate D68 callable."
    );
}

const block = source.slice(start, end);

const checks = [
    [
        "CALLABLE_EXISTS",
        block.includes(
            "exports.getPendingMembershipApplications = onCall(async (request) => {"
        )
    ],
    [
        "AUTHENTICATION_REQUIRED",
        block.includes("if (!request.auth)")
    ],
    [
        "CALLER_UID_READ",
        block.includes("const callerUid = request.auth.uid;")
    ],
    [
        "USER_PROFILE_LOOKUP",
        block.includes(
            'db.collection("users").doc(callerUid)'
        )
    ],
    [
        "USER_PROFILE_READ",
        block.includes(
            "await userRef.get()"
        )
    ],
    [
        "MISSING_PROFILE_REJECTED",
        block.includes(
            '"permission-denied"'
        ) &&
        block.includes(
            "Administrator profile not found."
        )
    ],
    [
        "COOPERATIVE_ADMIN_ROLE_REQUIRED",
        block.includes(
            'userData.role !== "cooperative_admin"'
        )
    ],
    [
        "COOPERATIVE_ADMIN_REJECTED",
        block.includes(
            "Only a Cooperative Admin can view membership applications."
        )
    ],
    [
        "COOPERATIVE_ID_DERIVED_FROM_PROFILE",
        block.includes(
            "userData.cooperativeId"
        )
    ],
    [
        "COOPERATIVE_ID_REQUIRED",
        block.includes(
            "Cooperative ownership is not configured for this administrator."
        )
    ],
    [
        "APPLICATION_COLLECTION_USED",
        block.includes(
            'collection("membershipApplications")'
        )
    ],
    [
        "COOPERATIVE_SCOPE_FILTER",
        block.includes(
            '.where("cooperativeId", "==", cooperativeId)'
        )
    ],
    [
        "PENDING_SCOPE_FILTER",
        block.includes(
            '.where("status", "==", "pending")'
        )
    ],
    [
        "APPLICATIONS_ARRAY_CREATED",
        block.includes(
            "const applications = [];"
        )
    ],
    [
        "APPLICATION_ID_RETURNED",
        block.includes(
            "applicationId:"
        )
    ],
    [
        "MEMBER_IDENTITY_RETURNED",
        block.includes("firstName:") &&
        block.includes("lastName:") &&
        block.includes("phone:")
    ],
    [
        "PENDING_STATUS_FORCED_IN_RESPONSE",
        block.includes('status: "pending"')
    ],
    [
        "SUCCESS_RESPONSE_EXISTS",
        block.includes(
            "success: true"
        ) &&
        block.includes(
            "applications"
        )
    ],
    [
        "NO_CLIENT_COOPERATIVE_AUTHORITY",
        !block.includes(
            "request.data?.cooperativeId"
        )
    ],
    [
        "NO_MEMBER_COLLECTION_ACCESS",
        !block.includes(
            'db.collection("members")'
        )
    ],
    [
        "NO_MEMBER_ENGINE_USAGE",
        !block.includes(
            "CMPMemberEngine"
        )
    ],
    [
        "ORIGINAL_PUBLIC_SUBMISSION_REMAINS",
        source.includes(
            "exports.submitMembershipApplication = onCall(async (request) => {"
        )
    ]
];

let failed = false;

for (const [name, passed] of checks) {
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
        "RC406-D68 COOPERATIVE ADMIN MEMBERSHIP APPLICATION RETRIEVAL AUDIT: FAIL"
    );
}

console.log(
    "RC406-D68 COOPERATIVE ADMIN MEMBERSHIP APPLICATION RETRIEVAL AUDIT: PASS"
);
