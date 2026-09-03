import fs from "fs";

const html =
    fs.readFileSync(
        "modules/membership-application/index.html",
        "utf8"
    );

const app =
    fs.readFileSync(
        "modules/membership-application/app.js",
        "utf8"
    );

const checks = [
    [
        "APPLICATION_FORM_EXISTS",
        html.includes(
            'id="membershipApplicationForm"'
        )
    ],
    [
        "FIRST_NAME_FIELD_EXISTS",
        html.includes(
            'id="firstName"'
        )
    ],
    [
        "MIDDLE_NAME_FIELD_EXISTS",
        html.includes(
            'id="middleName"'
        )
    ],
    [
        "LAST_NAME_FIELD_EXISTS",
        html.includes(
            'id="lastName"'
        )
    ],
    [
        "PHONE_FIELD_EXISTS",
        html.includes(
            'id="phone"'
        )
    ],
    [
        "EMAIL_FIELD_EXISTS",
        html.includes(
            'id="email"'
        )
    ],
    [
        "COOPERATIVE_SELECTOR_EXISTS",
        html.includes(
            'id="cooperativeId"'
        )
    ],
    [
        "APPLICATION_MESSAGE_EXISTS",
        html.includes(
            'id="applicationMessage"'
        )
    ],
    [
        "COOPERATIVE_MESSAGE_EXISTS",
        html.includes(
            'id="cooperativeMessage"'
        )
    ],
    [
        "MODULE_SCRIPT_EXISTS",
        html.includes(
            '<script type="module" src="./app.js"></script>'
        )
    ],
    [
        "DISCOVERY_SERVICE_IMPORTED",
        app.includes(
            "getActiveCooperatives"
        )
    ],
    [
        "SUBMISSION_SERVICE_IMPORTED",
        app.includes(
            "submitMembershipApplication"
        )
    ],
    [
        "COOPERATIVE_OPTIONS_HANDLED",
        app.includes(
            "cooperativeId"
        )
    ],
    [
        "APPLICATION_SUBMISSION_HANDLED",
        app.includes(
            "membershipApplicationForm"
        )
    ],
    [
        "SUBMISSION_SERVICE_CALLED",
        app.includes(
            "submitMembershipApplication("
        )
    ],
    [
        "NO_DIRECT_FIRESTORE_ACCESS",
        !app.includes(
            "firebase-firestore.js"
        )
    ],
    [
        "NO_MEMBER_ENGINE_USAGE",
        !app.includes(
            "CMPMemberEngine"
        )
    ],
    [
        "NO_REGISTER_MEMBER_USAGE",
        !app.includes(
            "registerMember"
        )
    ],
    [
        "NO_DIRECT_MEMBER_COLLECTION_WRITE",
        !app.includes(
            'collection("members")'
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
        "RC406-D72 PUBLIC MEMBERSHIP APPLICATION AUDIT: FAIL"
    );
    process.exit(1);
}

console.log(
    "RC406-D72 PUBLIC MEMBERSHIP APPLICATION AUDIT: PASS"
);
