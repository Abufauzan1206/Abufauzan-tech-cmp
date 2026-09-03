import fs from "fs";

const source =
    fs.readFileSync(
        "functions/index.js",
        "utf8"
    );

const approvalStart =
    source.indexOf(
        "exports.approveMembershipApplication"
    );

const rejectionStart =
    source.indexOf(
        "exports.rejectMembershipApplication"
    );

const submissionStart =
    source.indexOf(
        "exports.submitMembershipApplication"
    );

const contextStart =
    source.indexOf(
        "async function getCooperativeAdminDecisionContext"
    );

const approvalBlock =
    approvalStart >= 0 && rejectionStart > approvalStart
        ? source.slice(approvalStart, rejectionStart)
        : "";

const rejectionBlock =
    rejectionStart >= 0 && submissionStart > rejectionStart
        ? source.slice(rejectionStart, submissionStart)
        : "";

const contextBlock =
    contextStart >= 0 && approvalStart > contextStart
        ? source.slice(contextStart, approvalStart)
        : "";

const checks = [
    [
        "DECISION_CONTEXT_EXISTS",
        contextStart >= 0
    ],
    [
        "AUTHENTICATION_REQUIRED",
        contextBlock.includes(
            "if (!request.auth)"
        )
    ],
    [
        "CALLER_UID_DERIVED_FROM_AUTH",
        contextBlock.includes(
            "request.auth.uid"
        )
    ],
    [
        "USER_PROFILE_LOOKUP_EXISTS",
        contextBlock.includes(
            'db.collection("users").doc(callerUid).get()'
        )
    ],
    [
        "MISSING_PROFILE_REJECTED",
        contextBlock.includes(
            "Administrator profile not found."
        )
    ],
    [
        "COOPERATIVE_ADMIN_ROLE_REQUIRED",
        contextBlock.includes(
            'userData.role !== "cooperative_admin"'
        )
    ],
    [
        "SUPER_ADMIN_NOT_ACCEPTED_BY_ROLE_GATE",
        contextBlock.includes(
            'userData.role !== "cooperative_admin"'
        ) &&
        !contextBlock.includes(
            'userData.role === "super_admin"'
        )
    ],
    [
        "COOPERATIVE_ID_DERIVED_FROM_PROFILE",
        contextBlock.includes(
            "userData.cooperativeId"
        )
    ],
    [
        "COOPERATIVE_ID_REQUIRED",
        contextBlock.includes(
            "Cooperative ownership is not configured"
        )
    ],
    [
        "APPROVAL_USES_CONTEXT",
        approvalBlock.includes(
            "getCooperativeAdminDecisionContext(request)"
        )
    ],
    [
        "REJECTION_USES_CONTEXT",
        rejectionBlock.includes(
            "getCooperativeAdminDecisionContext(request)"
        )
    ],
    [
        "APPROVAL_OWNERSHIP_CHECK",
        approvalBlock.includes(
            "application.cooperativeId !== cooperativeId"
        )
    ],
    [
        "REJECTION_OWNERSHIP_CHECK",
        rejectionBlock.includes(
            "application.cooperativeId !== cooperativeId"
        )
    ],
    [
        "APPROVAL_PERMISSION_DENIED_ON_MISMATCH",
        approvalBlock.includes(
            "This application does not belong to your cooperative."
        )
    ],
    [
        "REJECTION_PERMISSION_DENIED_ON_MISMATCH",
        rejectionBlock.includes(
            "This application does not belong to your cooperative."
        )
    ],
    [
        "APPROVAL_APPLICATION_ID_FROM_REQUEST",
        approvalBlock.includes(
            "request?.data"
        )
    ],
    [
        "REJECTION_APPLICATION_ID_FROM_REQUEST",
        rejectionBlock.includes(
            "request?.data"
        )
    ],
    [
        "NO_PUBLIC_APPROVAL_AUTHORITY",
        approvalBlock.includes(
            "getCooperativeAdminDecisionContext(request)"
        ) &&
        !approvalBlock.includes(
            "allow"
        )
    ],
    [
        "NO_PUBLIC_REJECTION_AUTHORITY",
        rejectionBlock.includes(
            "getCooperativeAdminDecisionContext(request)"
        ) &&
        !rejectionBlock.includes(
            "allow"
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
        "RC406-D79 MEMBERSHIP APPLICATION AUTHORIZATION AUDIT: FAIL"
    );
    process.exit(1);
}

console.log(
    "RC406-D79 MEMBERSHIP APPLICATION AUTHORIZATION AUDIT: PASS"
);
