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
        "APPROVAL_PENDING_REQUIRED",
        approvalBlock.includes(
            'application.status !== "pending"'
        )
    ],
    [
        "REJECTION_PENDING_REQUIRED",
        rejectionBlock.includes(
            'application.status !== "pending"'
        )
    ],
    [
        "APPROVAL_FAILED_PRECONDITION_EXISTS",
        approvalBlock.includes(
            "failed-precondition"
        )
    ],
    [
        "REJECTION_FAILED_PRECONDITION_EXISTS",
        rejectionBlock.includes(
            "failed-precondition"
        )
    ],
    [
        "APPROVAL_STATUS_APPROVED",
        approvalBlock.includes(
            'status: "approved"'
        )
    ],
    [
        "REJECTION_STATUS_REJECTED",
        rejectionBlock.includes(
            'status: "rejected"'
        )
    ],
    [
        "APPROVAL_MEMBER_CREATED",
        approvalBlock.includes(
            "transaction.create(memberRef, memberData)"
        )
    ],
    [
        "REJECTION_NO_MEMBER_CREATION",
        !rejectionBlock.includes(
            "transaction.create(memberRef"
        )
    ],
    [
        "APPROVAL_APPLICATION_UPDATED",
        approvalBlock.includes(
            "transaction.update(applicationRef"
        )
    ],
    [
        "REJECTION_APPLICATION_UPDATED",
        rejectionBlock.includes(
            "transaction.update(applicationRef"
        )
    ],
    [
        "APPROVAL_TRANSACTION_EXISTS",
        approvalBlock.includes(
            "db.runTransaction"
        )
    ],
    [
        "REJECTION_TRANSACTION_EXISTS",
        rejectionBlock.includes(
            "db.runTransaction"
        )
    ],
    [
        "APPROVAL_MEMBER_ID_LINKED",
        approvalBlock.includes(
            "memberId,"
        )
    ],
    [
        "APPROVAL_ONLY_PENDING_MESSAGE",
        approvalBlock.includes(
            "Only pending membership applications can be approved."
        )
    ],
    [
        "REJECTION_ONLY_PENDING_MESSAGE",
        rejectionBlock.includes(
            "Only pending membership applications can be rejected."
        )
    ],
    [
        "SUBMISSION_CALLABLE_REMAINS",
        submissionStart >= 0
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
        "RC406-D76 MEMBERSHIP APPLICATION STATE TRANSITION AUDIT: FAIL"
    );
    process.exit(1);
}

console.log(
    "RC406-D76 MEMBERSHIP APPLICATION STATE TRANSITION AUDIT: PASS"
);
