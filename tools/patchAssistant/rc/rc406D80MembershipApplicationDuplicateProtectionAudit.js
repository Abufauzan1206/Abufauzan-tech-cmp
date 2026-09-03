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

const submissionEnd =
    source.indexOf(
        "exports.submitCooperativeApplication"
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
        ? source.slice(approvalStart, rejectionStart)
        : "";

const submissionBlock =
    submissionStart >= 0 && submissionEnd > submissionStart
        ? source.slice(submissionStart, submissionEnd)
        : "";

const checks = [
    [
        "SUBMISSION_CALLABLE_EXISTS",
        submissionStart >= 0
    ],
    [
        "APPROVAL_CALLABLE_EXISTS",
        approvalStart >= 0
    ],
    [
        "SUBMISSION_COOPERATIVE_LOOKUP_EXISTS",
        submissionBlock.includes(
            'collection("cooperatives")'
        )
    ],
    [
        "SUBMISSION_APPLICATION_COLLECTION_EXISTS",
        submissionBlock.includes(
            'collection("membershipApplications")'
        )
    ],
    [
        "APPROVAL_MEMBER_COLLECTION_EXISTS",
        approvalBlock.includes(
            'collection("members")'
        )
    ],
    [
        "APPROVAL_PENDING_GUARD_EXISTS",
        approvalBlock.includes(
            'application.status !== "pending"'
        )
    ],
    [
        "PHONE_AVAILABLE_IN_SUBMISSION",
        submissionBlock.includes(
            "phone"
        )
    ],
    [
        "EMAIL_AVAILABLE_IN_SUBMISSION",
        submissionBlock.includes(
            "email"
        )
    ],
    [
        "PHONE_AVAILABLE_IN_APPROVAL",
        approvalBlock.includes(
            "phone"
        )
    ],
    [
        "EMAIL_AVAILABLE_IN_APPROVAL",
        approvalBlock.includes(
            "email"
        )
    ],
    [
        "DUPLICATE_APPLICATION_PROTECTION_PRESENT",
        submissionBlock.includes(
            "duplicate"
        ) ||
        submissionBlock.includes(
            "already exists"
        ) ||
        submissionBlock.includes(
            "pendingSnapshot"
        )
    ],
    [
        "DUPLICATE_MEMBER_PROTECTION_PRESENT",
        approvalBlock.includes(
            "duplicate"
        ) ||
        approvalBlock.includes(
            "already exists"
        ) ||
        approvalBlock.includes(
            "existingMember"
        ) ||
        approvalBlock.includes(
            "duplicateMember"
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
        "RC406-D80 MEMBERSHIP APPLICATION DUPLICATE PROTECTION AUDIT: FAIL"
    );
    process.exit(1);
}

console.log(
    "RC406-D80 MEMBERSHIP APPLICATION DUPLICATE PROTECTION AUDIT: PASS"
);
