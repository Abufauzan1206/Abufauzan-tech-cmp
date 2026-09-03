import fs from "fs";

const source =
    fs.readFileSync(
        "modules/membership-application/app.js",
        "utf8"
    );

const checks = [
    [
        "FORM_REFERENCE_EXISTS",
        source.includes(
            '"membershipApplicationForm"'
        )
    ],
    [
        "FORM_DATA_COLLECTION_EXISTS",
        source.includes(
            "new FormData(form)"
        )
    ],
    [
        "FIRST_NAME_READ_FROM_FORM",
        source.includes(
            'formData.get("firstName")'
        )
    ],
    [
        "LAST_NAME_READ_FROM_FORM",
        source.includes(
            'formData.get("lastName")'
        )
    ],
    [
        "PHONE_READ_FROM_FORM",
        source.includes(
            'formData.get("phone")'
        )
    ],
    [
        "COOPERATIVE_READ_FROM_FORM",
        source.includes(
            'formData.get("cooperativeId")'
        )
    ],
    [
        "FORM_SUBMIT_HANDLER_EXISTS",
        source.includes(
            'addEventListener("submit"'
        )
    ],
    [
        "FIRST_NAME_VALIDATION_PRESENT",
        source.includes(
            "First name is required."
        )
    ],
    [
        "LAST_NAME_VALIDATION_PRESENT",
        source.includes(
            "Last name is required."
        )
    ],
    [
        "PHONE_VALIDATION_PRESENT",
        source.includes(
            "Phone number is required."
        )
    ],
    [
        "COOPERATIVE_VALIDATION_PRESENT",
        source.includes(
            "Please select a cooperative."
        )
    ],
    [
        "VALIDATION_FUNCTION_EXISTS",
        source.includes(
            "function validateApplication(data)"
        )
    ],
    [
        "VALIDATION_CALLED_BEFORE_SUBMISSION",
        source.includes(
            "validateApplication(data)"
        ) &&
        source.indexOf(
            "validateApplication(data)"
        ) <
        source.indexOf(
            "submitMembershipApplication(data)"
        )
    ],
    [
        "SUBMISSION_CALL_REMAINS",
        source.includes(
            "submitMembershipApplication(data)"
        )
    ],
    [
        "DISCOVERY_CALL_REMAINS",
        source.includes(
            "getActiveCooperatives()"
        )
    ],
    [
        "NO_DIRECT_FIRESTORE_ACCESS",
        !source.includes(
            "firebase-firestore.js"
        )
    ],
    [
        "NO_MEMBER_ENGINE_USAGE",
        !source.includes(
            "CMPMemberEngine"
        )
    ],
    [
        "NO_REGISTER_MEMBER_USAGE",
        !source.includes(
            "registerMember"
        )
    ],
    [
        "NO_DIRECT_MEMBER_COLLECTION_WRITE",
        !source.includes(
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
        "RC406-D73 PUBLIC MEMBERSHIP VALIDATION AUDIT: FAIL"
    );
    process.exit(1);
}

console.log(
    "RC406-D73 PUBLIC MEMBERSHIP VALIDATION AUDIT: PASS"
);
