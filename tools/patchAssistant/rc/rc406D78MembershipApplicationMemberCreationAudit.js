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
        ? source.slice(approvalStart, rejectionStart)
        : "";

const memberIdGeneratorStart =
    source.indexOf(
        "function generateMemberId()"
    );

const memberIdGeneratorEnd =
    source.indexOf(
        "exports.approveMembershipApplication"
    );

const memberIdGeneratorBlock =
    memberIdGeneratorStart >= 0 &&
    memberIdGeneratorEnd > memberIdGeneratorStart
        ? source.slice(
            memberIdGeneratorStart,
            memberIdGeneratorEnd
        )
        : "";

const memberDataStart =
    approvalBlock.indexOf(
        "const memberData = {"
    );

const memberDataEnd =
    approvalBlock.indexOf(
        "transaction.create(memberRef, memberData)"
    );

const memberDataBlock =
    memberDataStart >= 0 &&
    memberDataEnd > memberDataStart
        ? approvalBlock.slice(
            memberDataStart,
            memberDataEnd
        )
        : "";

const checks = [
    [
        "APPROVAL_CALLABLE_EXISTS",
        approvalStart >= 0
    ],
    [
        "MEMBER_ID_GENERATOR_EXISTS",
        memberIdGeneratorBlock.includes(
            "function generateMemberId()"
        )
    ],
    [
        "MEMBER_ID_PREFIX_CORRECT",
        memberIdGeneratorBlock.includes(
            "ATC-MEM-${year}-${randomPart}"
        )
    ],
    [
        "MEMBER_COLLECTION_USED",
        approvalBlock.includes(
            'collection("members")'
        )
    ],
    [
        "MEMBER_DOCUMENT_REFERENCE_EXISTS",
        approvalBlock.includes(
            'db.collection("members").doc(memberId)'
        )
    ],
    [
        "MEMBER_DATA_EXISTS",
        memberDataBlock.includes(
            "const memberData = {"
        )
    ],
    [
        "MEMBER_COOPERATIVE_ID_PERSISTED",
        memberDataBlock.includes(
            "cooperativeId,"
        )
    ],
    [
        "MEMBER_FIRST_NAME_PERSISTED",
        memberDataBlock.includes(
            "firstName,"
        )
    ],
    [
        "MEMBER_LAST_NAME_PERSISTED",
        memberDataBlock.includes(
            "lastName,"
        )
    ],
    [
        "MEMBER_PHONE_PERSISTED",
        memberDataBlock.includes(
            "phone,"
        )
    ],
    [
        "MEMBER_EMAIL_OPTIONAL",
        memberDataBlock.includes(
            "...(email ? { email } : {})"
        )
    ],
    [
        "MEMBER_MIDDLE_NAME_OPTIONAL",
        memberDataBlock.includes(
            "...(middleName ? { middleName } : {})"
        )
    ],
    [
        "MEMBER_STATUS_ACTIVE",
        memberDataBlock.includes(
            'status: "active"'
        )
    ],
    [
        "MEMBER_CREATED_AT_PERSISTED",
        memberDataBlock.includes(
            "createdAt: FieldValue.serverTimestamp()"
        )
    ],
    [
        "MEMBER_CREATED_TRANSACTIONALLY",
        approvalBlock.includes(
            "transaction.create(memberRef, memberData)"
        )
    ],
    [
        "APPLICATION_MEMBER_ID_LINKED",
        approvalBlock.includes(
            "memberId,"
        )
    ],
    [
        "APPLICATION_ID_NOT_IN_MEMBER_DATA",
        !memberDataBlock.includes(
            "applicationId"
        )
    ],
    [
        "MEMBER_ENGINE_NOT_USED",
        !approvalBlock.includes(
            "CMPMemberEngine"
        )
    ],
    [
        "REGISTER_MEMBER_NOT_USED",
        !approvalBlock.includes(
            "registerMember"
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
        "RC406-D78 MEMBERSHIP APPLICATION MEMBER CREATION AUDIT: FAIL"
    );
    process.exit(1);
}

console.log(
    "RC406-D78 MEMBERSHIP APPLICATION MEMBER CREATION AUDIT: PASS"
);
