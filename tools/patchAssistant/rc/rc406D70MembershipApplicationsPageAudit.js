import fs from "fs";

const source =
    fs.readFileSync(
        "modules/members/membership-applications/index.html",
        "utf8"
    );

const checks = [
    [
        "PAGE_EXISTS",
        source.includes("<title>Membership Applications</title>")
    ],
    [
        "APPLICATION_HEADING_EXISTS",
        source.includes("Membership Applications")
    ],
    [
        "APPLICATION_COUNT_ELEMENT_EXISTS",
        source.includes('id="applicationCount"')
    ],
    [
        "APPLICATION_MESSAGE_ELEMENT_EXISTS",
        source.includes('id="applicationMessage"')
    ],
    [
        "APPLICATIONS_TABLE_EXISTS",
        source.includes('id="applicationsTable"')
    ],
    [
        "APPLICATIONS_BODY_EXISTS",
        source.includes('id="applicationsBody"')
    ],
    [
        "APPLICANT_COLUMN_EXISTS",
        source.includes("<th>Applicant</th>")
    ],
    [
        "PHONE_COLUMN_EXISTS",
        source.includes("<th>Phone</th>")
    ],
    [
        "EMAIL_COLUMN_EXISTS",
        source.includes("<th>Email</th>")
    ],
    [
        "APPLICATION_ID_COLUMN_EXISTS",
        source.includes("<th>Application ID</th>")
    ],
    [
        "STATUS_COLUMN_EXISTS",
        source.includes("<th>Status</th>")
    ],
    [
        "SUBMITTED_COLUMN_EXISTS",
        source.includes("<th>Submitted</th>")
    ],
    [
        "ACTIONS_COLUMN_EXISTS",
        source.includes("<th>Actions</th>")
    ],
    [
        "LOADING_STATE_EXISTS",
        source.includes("Loading applications...")
    ],
    [
        "BACK_TO_MEMBERS_EXISTS",
        source.includes('href="../index.html"')
    ],
    [
        "MODULE_SCRIPT_BOUNDARY_EXISTS",
        source.includes(
            '<script type="module" src="./app.js"></script>'
        )
    ],
    [
        "NO_DIRECT_FIRESTORE_ACCESS",
        !source.includes("firebase-firestore")
    ],
    [
        "NO_PUBLIC_MEMBER_CREATION",
        !source.includes("registerMember")
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
        "RC406-D70 MEMBERSHIP APPLICATIONS PAGE AUDIT: FAIL"
    );
    process.exit(1);
}

console.log(
    "RC406-D70 MEMBERSHIP APPLICATIONS PAGE AUDIT: PASS"
);
