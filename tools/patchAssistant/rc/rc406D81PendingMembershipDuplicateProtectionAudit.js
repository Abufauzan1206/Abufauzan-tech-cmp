import fs from "fs";

const source =
    fs.readFileSync(
        "functions/index.js",
        "utf8"
    );

const start =
    source.indexOf(
        "exports.submitMembershipApplication"
    );

const end =
    source.indexOf(
        "exports.submitCooperativeApplication"
    );

const block =
    start >= 0 && end > start
        ? source.slice(start, end)
        : "";

const applicationCreateIndex =
    block.indexOf(
        'db.collection("membershipApplications").doc();'
    );

const duplicateCheckIndex =
    block.indexOf(
        "duplicatePendingApplication"
    );

const checks = [
    [
        "SUBMISSION_CALLABLE_EXISTS",
        start >= 0
    ],
    [
        "PENDING_APPLICATION_QUERY_EXISTS",
        block.includes(
            'collection("membershipApplications")'
        ) &&
        block.includes(
            '.where("status", "==", "pending")'
        )
    ],
    [
        "COOPERATIVE_SCOPE_EXISTS",
        block.includes(
            '.where("cooperativeId", "==", cooperativeId)'
        )
    ],
    [
        "PENDING_APPLICATION_SNAPSHOT_EXISTS",
        block.includes(
            "pendingApplicationsSnapshot"
        )
    ],
    [
        "PHONE_NORMALIZED_FOR_DUPLICATE_CHECK",
        block.includes(
            "const normalizedPhone ="
        )
    ],
    [
        "EMAIL_NORMALIZED_FOR_DUPLICATE_CHECK",
        block.includes(
            "const normalizedEmail ="
        )
    ],
    [
        "EXISTING_PHONE_NORMALIZED",
        block.includes(
            "applicationPhone === normalizedPhone"
        )
    ],
    [
        "EXISTING_EMAIL_NORMALIZED",
        block.includes(
            "applicationEmail === normalizedEmail"
        )
    ],
    [
        "DUPLICATE_MATCH_EXISTS",
        duplicateCheckIndex >= 0
    ],
    [
        "DUPLICATE_REJECTED",
        block.includes(
            '"already-exists"'
        )
    ],
    [
        "DUPLICATE_ERROR_MESSAGE_EXISTS",
        block.includes(
            "A pending membership application already exists"
        )
    ],
    [
        "DUPLICATE_CHECK_BEFORE_APPLICATION_CREATION",
        duplicateCheckIndex >= 0 &&
        applicationCreateIndex >= 0 &&
        duplicateCheckIndex < applicationCreateIndex
    ],
    [
        "PUBLIC_SUBMISSION_REMAINS",
        block.includes(
            "exports.submitMembershipApplication"
        )
    ],
    [
        "NO_MEMBER_COLLECTION_WRITE",
        !block.includes(
            'collection("members")'
        )
    ],
    [
        "NO_MEMBER_ENGINE_USAGE",
        !block.includes(
            "CMPMemberEngine"
        )
    ],
    [
        "NO_REGISTER_MEMBER_USAGE",
        !block.includes(
            "registerMember"
        )
    ],
    [
        "NO_ADMINISTRATOR_FIELDS",
        !block.includes(
            "adminPassword"
        ) &&
        !block.includes(
            "administratorUid"
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
        "RC406-D81 PENDING MEMBERSHIP DUPLICATE PROTECTION AUDIT: FAIL"
    );
    process.exit(1);
}

console.log(
    "RC406-D81 PENDING MEMBERSHIP DUPLICATE PROTECTION AUDIT: PASS"
);
