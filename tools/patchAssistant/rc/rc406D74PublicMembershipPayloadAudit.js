import fs from "fs";

const source =
    fs.readFileSync(
        "modules/membership-application/app.js",
        "utf8"
    );

const checks = [
    [
        "FORM_DATA_COLLECTION_EXISTS",
        source.includes("new FormData(form)")
    ],
    [
        "FIRST_NAME_PAYLOAD_EXISTS",
        source.includes('firstName:')
    ],
    [
        "MIDDLE_NAME_PAYLOAD_EXISTS",
        source.includes('middleName:')
    ],
    [
        "LAST_NAME_PAYLOAD_EXISTS",
        source.includes('lastName:')
    ],
    [
        "PHONE_PAYLOAD_EXISTS",
        source.includes('phone:')
    ],
    [
        "EMAIL_PAYLOAD_EXISTS",
        source.includes('email:')
    ],
    [
        "COOPERATIVE_ID_PAYLOAD_EXISTS",
        source.includes('cooperativeId:')
    ],
    [
        "FIRST_NAME_NORMALIZED",
        source.includes(
            'formData.get("firstName") ?? ""'
        ) &&
        source.includes(".trim()")
    ],
    [
        "LAST_NAME_NORMALIZED",
        source.includes(
            'formData.get("lastName") ?? ""'
        ) &&
        source.includes(".trim()")
    ],
    [
        "PHONE_NORMALIZED",
        source.includes(
            'formData.get("phone") ?? ""'
        ) &&
        source.includes(".trim()")
    ],
    [
        "COOPERATIVE_ID_NORMALIZED",
        source.includes(
            'formData.get("cooperativeId") ?? ""'
        ) &&
        source.includes(".trim()")
    ],
    [
        "EMAIL_NORMALIZED",
        source.includes(
            'formData.get("email") ?? ""'
        ) &&
        source.includes(".trim()")
    ],
    [
        "SUBMISSION_USES_NORMALIZED_DATA",
        source.includes(
            "submitMembershipApplication(data)"
        )
    ],
    [
        "NO_FORMDATA_SPREAD",
        !source.includes(
            "Object.fromEntries(formData)"
        )
    ],
    [
        "NO_RAW_FORMDATA_SUBMISSION",
        !source.includes(
            "submitMembershipApplication(formData)"
        )
    ],
    [
        "NO_ADMIN_NAME_PAYLOAD",
        !source.includes(
            "adminName"
        )
    ],
    [
        "NO_ADMIN_EMAIL_PAYLOAD",
        !source.includes(
            "adminEmail"
        )
    ],
    [
        "NO_ADMIN_PASSWORD_PAYLOAD",
        !source.includes(
            "adminPassword"
        )
    ],
    [
        "NO_SUBSCRIPTION_PAYLOAD",
        !source.includes(
            "subscriptionPlan"
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
        "NO_DIRECT_FIRESTORE_ACCESS",
        !source.includes(
            "firebase-firestore.js"
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
        "RC406-D74 PUBLIC MEMBERSHIP PAYLOAD AUDIT: FAIL"
    );
    process.exit(1);
}

console.log(
    "RC406-D74 PUBLIC MEMBERSHIP PAYLOAD AUDIT: PASS"
);
