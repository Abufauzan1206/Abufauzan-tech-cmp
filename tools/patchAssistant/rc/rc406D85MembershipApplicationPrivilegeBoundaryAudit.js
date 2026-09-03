import fs from "fs";

const source =
    fs.readFileSync(
        "functions/index.js",
        "utf8"
    );

const submissionStart =
    source.indexOf(
        "exports.submitMembershipApplication"
    );

const pendingStart =
    source.indexOf(
        "exports.getPendingMembershipApplications"
    );

const approvalStart =
    source.indexOf(
        "exports.approveMembershipApplication"
    );

const rejectionStart =
    source.indexOf(
        "exports.rejectMembershipApplication"
    );

const submissionEnd =
    pendingStart > submissionStart &&
    pendingStart >= 0
        ? pendingStart
        : source.length;

const pendingEnd =
    approvalStart > pendingStart &&
    approvalStart >= 0
        ? approvalStart
        : source.length;

const approvalEnd =
    rejectionStart > approvalStart &&
    rejectionStart >= 0
        ? rejectionStart
        : source.length;

const submissionBlock =
    submissionStart >= 0
        ? source.slice(
            submissionStart,
            submissionEnd
        )
        : "";

const pendingBlock =
    pendingStart >= 0
        ? source.slice(
            pendingStart,
            pendingEnd
        )
        : "";

const approvalBlock =
    approvalStart >= 0
        ? source.slice(
            approvalStart,
            approvalEnd
        )
        : "";

const rejectionBlock =
    rejectionStart >= 0
        ? source.slice(
            rejectionStart
        )
        : "";

const checks = [
    [
        "PUBLIC_SUBMISSION_CALLABLE_EXISTS",
        submissionStart >= 0
    ],
    [
        "PUBLIC_SUBMISSION_HAS_NO_AUTH_REQUIREMENT",
        !submissionBlock.includes(
            "request.auth"
        ) ||
        (
            submissionBlock.includes(
                "request.auth"
            ) &&
            !submissionBlock.includes(
                'throw new HttpsError("unauthenticated"'
            )
        )
    ],
    [
        "PENDING_RETRIEVAL_CALLABLE_EXISTS",
        pendingStart >= 0
    ],
    [
        "PENDING_RETRIEVAL_REQUIRES_AUTH",
        pendingBlock.includes(
            "if (!request.auth)"
        )
    ],
    [
        "PENDING_RETRIEVAL_REQUIRES_COOPERATIVE_ADMIN",
        pendingBlock.includes(
            'userData.role !== "cooperative_admin"'
        )
    ],
    [
        "APPROVAL_CALLABLE_EXISTS",
        approvalStart >= 0
    ],
    [
        "APPROVAL_REQUIRES_AUTH",
        approvalBlock.includes(
            "getCooperativeAdminDecisionContext"
        )
    ],
    [
        "APPROVAL_REQUIRES_COOPERATIVE_ADMIN",
        approvalBlock.includes(
            "getCooperativeAdminDecisionContext"
        )
    ],
    [
        "REJECTION_CALLABLE_EXISTS",
        rejectionStart >= 0
    ],
    [
        "REJECTION_REQUIRES_AUTH",
        rejectionBlock.includes(
            "getCooperativeAdminDecisionContext"
        )
    ],
    [
        "REJECTION_REQUIRES_COOPERATIVE_ADMIN",
        rejectionBlock.includes(
            "getCooperativeAdminDecisionContext"
        )
    ],
    [
        "PUBLIC_SUBMISSION_DOES_NOT_WRITE_MEMBERS",
        !submissionBlock.includes(
            '.collection("members")'
        )
    ],
    [
        "PUBLIC_SUBMISSION_DOES_NOT_APPROVE",
        !submissionBlock.includes(
            "approveMembershipApplication"
        )
    ],
    [
        "PUBLIC_SUBMISSION_DOES_NOT_REJECT",
        !submissionBlock.includes(
            "rejectMembershipApplication"
        )
    ],
    [
        "PUBLIC_SUBMISSION_CREATES_MEMBERSHIP_APPLICATION",
        submissionBlock.includes(
            "membershipApplications"
        )
    ],
    [
        "PUBLIC_SUBMISSION_FORCES_PENDING",
        submissionBlock.includes(
            'status: "pending"'
        )
    ],
    [
        "APPROVAL_REQUIRES_COOPERATIVE_OWNERSHIP",
        approvalBlock.includes(
            "cooperativeId"
        ) &&
        approvalBlock.includes(
            "application.cooperativeId"
        )
    ],
    [
        "REJECTION_REQUIRES_COOPERATIVE_OWNERSHIP",
        rejectionBlock.includes(
            "cooperativeId"
        ) &&
        rejectionBlock.includes(
            "application.cooperativeId"
        )
    ]
];

let failed = false;

for (const [name, passed] of checks) {
    const status =
        passed ? "PASS" : "FAIL";

    if (!passed) {
        failed = true;
    }

    console.log(
        `${name}: ${status}`
    );
}

if (failed) {
    console.error(
        "RC406-D85 MEMBERSHIP APPLICATION PRIVILEGE BOUNDARY AUDIT: FAIL"
    );
    process.exit(1);
}

console.log(
    "RC406-D85 MEMBERSHIP APPLICATION PRIVILEGE BOUNDARY AUDIT: PASS"
);
