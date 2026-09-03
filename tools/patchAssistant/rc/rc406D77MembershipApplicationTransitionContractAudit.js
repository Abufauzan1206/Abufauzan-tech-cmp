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

const approvalBlock =
    approvalStart >= 0 && rejectionStart > approvalStart
        ? source.slice(approvalStart, rejectionStart)
        : "";

const rejectionBlock =
    rejectionStart >= 0 && submissionStart > rejectionStart
        ? source.slice(rejectionStart, submissionStart)
        : "";

const checks = [
    [
        "APPROVAL_CALLABLE_EXISTS",
        approvalStart >= 0
    ],
    [
        "REJECTION_CALLABLE_EXISTS",
        rejectionStart >= 0
    ],
    [
        "APPROVAL_REQUIRES_PENDING",
        approvalBlock.includes(
            'application.status !== "pending"'
        )
    ],
    [
        "REJECTION_REQUIRES_PENDING",
        rejectionBlock.includes(
            'application.status !== "pending"'
        )
    ],
    [
        "APPROVAL_SETS_APPROVED",
        approvalBlock.includes(
            'status: "approved"'
        )
    ],
    [
        "REJECTION_SETS_REJECTED",
        rejectionBlock.includes(
            'status: "rejected"'
        )
    ],
    [
        "APPROVAL_RECORDS_APPROVED_BY",
        approvalBlock.includes(
            "approvedBy: callerUid"
        )
    ],
    [
        "APPROVAL_RECORDS_APPROVED_AT",
        approvalBlock.includes(
            "approvedAt: FieldValue.serverTimestamp()"
        )
    ],
    [
        "REJECTION_RECORDS_REJECTED_BY",
        rejectionBlock.includes(
            "rejectedBy: callerUid"
        )
    ],
    [
        "REJECTION_RECORDS_REJECTED_AT",
        rejectionBlock.includes(
            "rejectedAt: FieldValue.serverTimestamp()"
        )
    ],
    [
        "APPROVAL_LINKS_MEMBER_ID",
        approvalBlock.includes(
            "memberId,"
        )
    ],
    [
        "APPROVAL_CREATES_ACTIVE_MEMBER",
        approvalBlock.includes(
            'status: "active"'
        ) &&
        approvalBlock.includes(
            "transaction.create(memberRef, memberData)"
        )
    ],
    [
        "APPROVAL_MEMBER_USES_APPLICATION_COOPERATIVE",
        approvalBlock.includes(
            "cooperativeId,"
        )
    ],
    [
        "REJECTION_DOES_NOT_CREATE_MEMBER",
        !rejectionBlock.includes(
            "transaction.create(memberRef"
        )
    ],
    [
        "REJECTION_DOES_NOT_LINK_MEMBER",
        !rejectionBlock.includes(
            "memberId:"
        )
    ],
    [
        "APPROVAL_IS_ATOMIC",
        approvalBlock.includes(
            "db.runTransaction"
        )
    ],
    [
        "REJECTION_IS_ATOMIC",
        rejectionBlock.includes(
            "db.runTransaction"
        )
    ],
    [
        "SUBMISSION_FORCES_PENDING",
        source.includes(
            'status: "pending"'
        )
    ],
    [
        "NO_DIRECT_CLIENT_APPROVAL_PATH",
        !source.includes(
            "allow write"
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
        "RC406-D77 MEMBERSHIP APPLICATION TRANSITION CONTRACT AUDIT: FAIL"
    );
    process.exit(1);
}

console.log(
    "RC406-D77 MEMBERSHIP APPLICATION TRANSITION CONTRACT AUDIT: PASS"
);
