import fs from "fs";

const source =
    fs.readFileSync(
        "functions/index.js",
        "utf8"
    );

const start =
    source.indexOf(
        "exports.approveMembershipApplication"
    );

const end =
    source.indexOf(
        "exports.rejectMembershipApplication"
    );

const block =
    start >= 0 && end > start
        ? source.slice(start, end)
        : "";

const checks = [
    [
        "APPROVAL_CALLABLE_EXISTS",
        start >= 0
    ],
    [
        "APPLICATION_LOOKUP_EXISTS",
        block.includes(
            'db.collection("membershipApplications").doc(applicationId)'
        )
    ],
    [
        "APPLICATION_COOPERATIVE_SCOPE_CHECK",
        block.includes(
            "application.cooperativeId !== cooperativeId"
        )
    ],
    [
        "APPLICATION_PENDING_REQUIRED",
        block.includes(
            'application.status !== "pending"'
        )
    ],
    [
        "MEMBER_COLLECTION_USED",
        block.includes(
            'db.collection("members")'
        )
    ],
    [
        "MEMBER_PHONE_PERSISTED",
        block.includes(
            "phone,"
        )
    ],
    [
        "MEMBER_EMAIL_PERSISTED",
        block.includes(
            "...(email ? { email } : {})"
        )
    ],
    [
        "MEMBER_COOPERATIVE_ID_PERSISTED",
        block.includes(
            "cooperativeId,"
        )
    ],
    [
        "MEMBER_CREATION_EXISTS",
        block.includes(
            "transaction.create(memberRef, memberData)"
        )
    ],
    [
        "TRANSACTION_EXISTS",
        block.includes(
            "db.runTransaction"
        )
    ],
    [
        "NO_MEMBER_PHONE_DUPLICATE_QUERY",
        !block.includes(
            'collection("members").where("phone"'
        )
    ],
    [
        "NO_MEMBER_EMAIL_DUPLICATE_QUERY",
        !block.includes(
            'collection("members").where("email"'
        )
    ],
    [
        "EXISTING_MEMBER_DUPLICATE_PROTECTION_PRESENT",
        block.includes(
            "existingMember"
        ) ||
        block.includes(
            "duplicateMember"
        ) ||
        block.includes(
            "duplicate"
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
        "RC406-D82 APPROVAL DUPLICATE MEMBER AUDIT: FAIL"
    );
    process.exit(1);
}

console.log(
    "RC406-D82 APPROVAL DUPLICATE MEMBER AUDIT: PASS"
);
