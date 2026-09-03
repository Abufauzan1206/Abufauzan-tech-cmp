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

const approvalBlock =
    approvalStart >= 0 && rejectionStart > approvalStart
        ? source.slice(
            approvalStart,
            rejectionStart
        )
        : "";

const rejectionBlock =
    rejectionStart >= 0
        ? source.slice(rejectionStart)
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
        "APPROVAL_APPLICATION_LOOKUP_EXISTS",
        approvalBlock.includes(
            "membershipApplications"
        ) &&
        approvalBlock.includes(
            "applicationRef"
        )
    ],
    [
        "REJECTION_APPLICATION_LOOKUP_EXISTS",
        rejectionBlock.includes(
            "membershipApplications"
        ) &&
        rejectionBlock.includes(
            "applicationRef"
        )
    ],
    [
        "APPROVAL_PENDING_GUARD_EXISTS",
        approvalBlock.includes(
            '"pending"'
        ) &&
        approvalBlock.includes(
            "failed-precondition"
        )
    ],
    [
        "REJECTION_PENDING_GUARD_EXISTS",
        rejectionBlock.includes(
            '"pending"'
        ) &&
        rejectionBlock.includes(
            "failed-precondition"
        )
    ],
    [
        "APPROVAL_FINAL_STATUS_EXISTS",
        approvalBlock.includes(
            'status: "approved"'
        )
    ],
    [
        "REJECTION_FINAL_STATUS_EXISTS",
        rejectionBlock.includes(
            'status: "rejected"'
        )
    ],
    [
        "APPROVAL_MEMBER_LINK_EXISTS",
        approvalBlock.includes(
            "memberId"
        )
    ],
    [
        "APPROVAL_MEMBER_CREATION_EXISTS",
        approvalBlock.includes(
            "transaction.create(memberRef, memberData)"
        )
    ],
    [
        "APPROVAL_APPLICATION_UPDATE_EXISTS",
        approvalBlock.includes(
            "transaction.update(applicationRef"
        )
    ],
    [
        "REJECTION_APPLICATION_UPDATE_EXISTS",
        rejectionBlock.includes(
            "applicationRef.update"
        ) ||
        rejectionBlock.includes(
            "transaction.update(applicationRef"
        )
    ],
    [
        "APPROVAL_ATOMIC_TRANSACTION_EXISTS",
        approvalBlock.includes(
            "db.runTransaction"
        )
    ],
    [
        "REJECTION_FINALIZATION_EXISTS",
        rejectionBlock.includes(
            "rejectedAt"
        ) &&
        rejectionBlock.includes(
            "rejectedBy"
        )
    ],
    [
        "APPROVAL_RECORDS_APPROVER",
        approvalBlock.includes(
            "approvedBy"
        ) &&
        approvalBlock.includes(
            "approvedAt"
        )
    ],
    [
        "REJECTION_RECORDS_REJECTOR",
        rejectionBlock.includes(
            "rejectedBy"
        ) &&
        rejectionBlock.includes(
            "rejectedAt"
        )
    ],
    [
        "NO_APPROVAL_FROM_APPROVED_STATE",
        approvalBlock.includes(
            '"pending"'
        )
    ],
    [
        "NO_REJECTION_FROM_REJECTED_STATE",
        rejectionBlock.includes(
            '"pending"'
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
        "RC406-D84 MEMBERSHIP APPLICATION FINALIZATION AUDIT: FAIL"
    );
    process.exit(1);
}

console.log(
    "RC406-D84 MEMBERSHIP APPLICATION FINALIZATION AUDIT: PASS"
);
