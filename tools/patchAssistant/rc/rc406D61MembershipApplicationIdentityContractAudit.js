import fs from "fs";

const path =
    "js/business/membershipApplicationEngine.js";

const source = fs.readFileSync(path, "utf8");

const checks = [
    [
        "FIRST_NAME_REQUIRED",
        source.includes(
            'if (!application.firstName)'
        )
    ],
    [
        "LAST_NAME_REQUIRED",
        source.includes(
            'if (!application.lastName)'
        )
    ],
    [
        "FIRST_NAME_NORMALIZED",
        source.includes(
            'typeof application.firstName === "string"'
        ) &&
        source.includes(
            "application.firstName.trim()"
        )
    ],
    [
        "MIDDLE_NAME_NORMALIZED",
        source.includes(
            'typeof application.middleName === "string"'
        ) &&
        source.includes(
            "application.middleName.trim()"
        )
    ],
    [
        "LAST_NAME_NORMALIZED",
        source.includes(
            'typeof application.lastName === "string"'
        ) &&
        source.includes(
            "application.lastName.trim()"
        )
    ],
    [
        "PHONE_NORMALIZED",
        source.includes(
            'typeof application.phone === "string"'
        ) &&
        source.includes(
            "application.phone.trim()"
        )
    ],
    [
        "EMAIL_NORMALIZED",
        source.includes(
            'typeof application.email === "string"'
        ) &&
        source.includes(
            "application.email.trim()"
        )
    ],
    [
        "COOPERATIVE_ID_NORMALIZED",
        source.includes(
            'typeof application.cooperativeId === "string"'
        ) &&
        source.includes(
            "application.cooperativeId.trim()"
        )
    ],
    [
        "APPLICATION_ID_GENERATED",
        source.includes(
            'CMPIdService.generate("MAP")'
        )
    ],
    [
        "PENDING_STATUS_FORCED",
        source.includes(
            'status: "pending"'
        )
    ],
    [
        "SUBMITTED_AT_CREATED",
        source.includes(
            "submittedAt: new Date()"
        )
    ],
    [
        "MEMBER_IDENTITY_FIELDS_PERSISTED",
        source.includes(
            "firstName,"
        ) &&
        source.includes(
            "lastName,"
        ) &&
        source.includes(
            "phone,"
        )
    ],
    [
        "FULL_NAME_CONTRACT_REMOVED",
        !source.includes(
            "application.fullName"
        ) &&
        !source.includes(
            "fullName,"
        )
    ],
    [
        "APPLICATION_REPOSITORY_PERSISTENCE",
        source.includes(
            ".membershipApplication"
        ) &&
        source.includes(
            ".create(newApplication)"
        )
    ],
    [
        "COOPERATIVE_RETRIEVAL_REMAINS_PRESENT",
        source.includes(
            "static async getByCooperativeId"
        ) &&
        source.includes(
            "findAllByCooperativeId"
        )
    ]
];

let failed = false;

for (const [name, passed] of checks) {
    console.log(
        `${name}: ${passed ? "PASS" : "FAIL"}`
    );

    if (!passed) {
        failed = true;
    }
}

if (failed) {
    console.error(
        "RC406-D61 MEMBERSHIP APPLICATION IDENTITY CONTRACT AUDIT: FAIL"
    );
    process.exit(1);
}

console.log(
    "RC406-D61 MEMBERSHIP APPLICATION IDENTITY CONTRACT AUDIT: PASS"
);
