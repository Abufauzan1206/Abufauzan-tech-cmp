import fs from "fs";

const source =
    fs.readFileSync(
        "functions/index.js",
        "utf8"
    );

const discoveryStart =
    source.indexOf(
        "exports.getActiveCooperatives"
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

const discoveryEnd =
    submissionStart > discoveryStart &&
    submissionStart >= 0
        ? submissionStart
        : source.length;

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

const discoveryBlock =
    discoveryStart >= 0
        ? source.slice(
            discoveryStart,
            discoveryEnd
        )
        : "";

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

const checks = [
    [
        "ACTIVE_DISCOVERY_CALLABLE_EXISTS",
        discoveryStart >= 0
    ],
    [
        "ACTIVE_DISCOVERY_FILTERS_ACTIVE_STATUS",
        discoveryBlock.includes(
            '"status", "==", "active"'
        )
    ],
    [
        "ACTIVE_DISCOVERY_RETURNS_COOPERATIVE_ID",
        discoveryBlock.includes(
            "cooperativeId:"
        )
    ],
    [
        "ACTIVE_DISCOVERY_RETURNS_COOPERATIVE_NAME",
        discoveryBlock.includes(
            "cooperativeName:"
        )
    ],
    [
        "ACTIVE_DISCOVERY_DOES_NOT_RETURN_ADMIN_PASSWORD",
        !discoveryBlock.includes(
            "adminPassword"
        )
    ],
    [
        "ACTIVE_DISCOVERY_DOES_NOT_RETURN_ADMIN_EMAIL",
        !discoveryBlock.includes(
            "adminEmail"
        )
    ],
    [
        "ACTIVE_DISCOVERY_DOES_NOT_RETURN_ADMIN_NAME",
        !discoveryBlock.includes(
            "adminName"
        )
    ],
    [
        "ACTIVE_DISCOVERY_DOES_NOT_RETURN_CONTACT_PHONE",
        !discoveryBlock.includes(
            "coopPhone"
        )
    ],
    [
        "PUBLIC_SUBMISSION_CALLABLE_EXISTS",
        submissionStart >= 0
    ],
    [
        "PUBLIC_SUBMISSION_RETURNS_SUCCESS",
        submissionBlock.includes(
            "applicationId"
        ) &&
        submissionBlock.includes(
            "success: true"
        )
    ],
    [
        "PUBLIC_SUBMISSION_DOES_NOT_RETURN_PASSWORD",
        !submissionBlock.includes(
            "adminPassword"
        )
    ],
    [
        "PENDING_QUEUE_CALLABLE_EXISTS",
        pendingStart >= 0
    ],
    [
        "PENDING_QUEUE_RETURNS_APPLICATIONS",
        pendingBlock.includes(
            "applications"
        )
    ],
    [
        "PENDING_QUEUE_INCLUDES_APPLICATION_ID",
        pendingBlock.includes(
            "applicationId"
        )
    ],
    [
        "PENDING_QUEUE_INCLUDES_APPLICANT_IDENTITY",
        pendingBlock.includes(
            "firstName"
        ) &&
        pendingBlock.includes(
            "lastName"
        )
    ],
    [
        "PENDING_QUEUE_INCLUDES_PHONE",
        pendingBlock.includes(
            "phone"
        )
    ],
    [
        "PENDING_QUEUE_DOES_NOT_RETURN_ADMIN_PASSWORD",
        !pendingBlock.includes(
            "adminPassword"
        )
    ],
    [
        "PENDING_QUEUE_DOES_NOT_RETURN_ADMIN_EMAIL",
        !pendingBlock.includes(
            "adminEmail"
        )
    ],
    [
        "PENDING_QUEUE_DOES_NOT_RETURN_ADMIN_PASSWORD_FIELD",
        !pendingBlock.includes(
            "password"
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
        "RC406-D86 MEMBERSHIP APPLICATION DATA EXPOSURE AUDIT: FAIL"
    );
    process.exit(1);
}

console.log(
    "RC406-D86 MEMBERSHIP APPLICATION DATA EXPOSURE AUDIT: PASS"
);
