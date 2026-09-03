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

const duplicateStart =
    block.indexOf(
        "const existingMembersSnapshot"
    );

const duplicateEnd =
    block.indexOf(
        "const duplicateActiveMember"
    );

const duplicateQueryBlock =
    duplicateStart >= 0 &&
    duplicateEnd > duplicateStart
        ? block.slice(
            duplicateStart,
            duplicateEnd
        )
        : "";

const memberCreationIndex =
    block.indexOf(
        "transaction.create(memberRef, memberData)"
    );

const duplicateIndex =
    block.indexOf(
        "duplicateActiveMember"
    );

const checks = [
    [
        "APPROVAL_CALLABLE_EXISTS",
        start >= 0
    ],
    [
        "ACTIVE_MEMBER_QUERY_EXISTS",
        duplicateQueryBlock.includes(
            '.collection("members")'
        ) &&
        duplicateQueryBlock.includes(
            '"status"'
        ) &&
        duplicateQueryBlock.includes(
            '"active"'
        )
    ],
    [
        "COOPERATIVE_SCOPE_EXISTS",
        duplicateQueryBlock.includes(
            '"cooperativeId"'
        ) &&
        duplicateQueryBlock.includes(
            "cooperativeId"
        )
    ],
    [
        "NORMALIZED_PHONE_EXISTS",
        block.includes(
            "const normalizedPhone ="
        )
    ],
    [
        "NORMALIZED_EMAIL_EXISTS",
        block.includes(
            "const normalizedEmail ="
        )
    ],
    [
        "EXISTING_PHONE_NORMALIZED",
        block.includes(
            "existingPhone === normalizedPhone"
        )
    ],
    [
        "EXISTING_EMAIL_NORMALIZED",
        block.includes(
            "existingEmail === normalizedEmail"
        )
    ],
    [
        "DUPLICATE_MEMBER_DETECTION_EXISTS",
        duplicateIndex >= 0
    ],
    [
        "DUPLICATE_MEMBER_REJECTED",
        block.includes(
            '"already-exists"'
        )
    ],
    [
        "DUPLICATE_ERROR_MESSAGE_EXISTS",
        block.includes(
            "An active member with the same phone number or email already exists"
        )
    ],
    [
        "DUPLICATE_CHECK_BEFORE_MEMBER_CREATION",
        duplicateIndex >= 0 &&
        memberCreationIndex >= 0 &&
        duplicateIndex < memberCreationIndex
    ],
    [
        "DUPLICATE_CHECK_INSIDE_TRANSACTION",
        block.includes(
            "await transaction.get("
        )
    ],
    [
        "MEMBER_CREATION_REMAINS",
        block.includes(
            "transaction.create(memberRef, memberData)"
        )
    ],
    [
        "APPLICATION_UPDATE_REMAINS",
        block.includes(
            "transaction.update(applicationRef"
        )
    ],
    [
        "APPROVAL_REMAINS_ATOMIC",
        block.includes(
            "db.runTransaction"
        )
    ],
    [
        "MEMBER_ENGINE_NOT_USED",
        !block.includes(
            "CMPMemberEngine"
        )
    ],
    [
        "REGISTER_MEMBER_NOT_USED",
        !block.includes(
            "registerMember"
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
        "RC406-D83 APPROVAL DUPLICATE MEMBER PROTECTION AUDIT: FAIL"
    );
    process.exit(1);
}

console.log(
    "RC406-D83 APPROVAL DUPLICATE MEMBER PROTECTION AUDIT: PASS"
);
