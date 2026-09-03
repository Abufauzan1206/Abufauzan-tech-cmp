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

const discoveryEnd =
    source.indexOf(
        "exports.getPendingMembershipApplications"
    );

const block =
    discoveryStart >= 0 && discoveryEnd > discoveryStart
        ? source.slice(discoveryStart, discoveryEnd)
        : "";

const checks = [
    [
        "DISCOVERY_CALLABLE_EXISTS",
        discoveryStart >= 0
    ],
    [
        "COOPERATIVES_COLLECTION_USED",
        block.includes(
            'collection("cooperatives")'
        )
    ],
    [
        "ACTIVE_STATUS_FILTER_EXISTS",
        block.includes(
            'where("status", "==", "active")'
        )
    ],
    [
        "SNAPSHOT_ITERATION_EXISTS",
        block.includes(
            "snapshot.forEach"
        )
    ],
    [
        "COOPERATIVE_ID_RETURNED",
        block.includes(
            "cooperativeId:"
        )
    ],
    [
        "COOPERATIVE_NAME_RETURNED",
        block.includes(
            "cooperativeName:"
        )
    ],
    [
        "INVALID_RECORDS_SKIPPED",
        block.includes(
            "return;"
        )
    ],
    [
        "COOPERATIVES_ARRAY_RETURNED",
        block.includes(
            "cooperatives"
        )
    ],
    [
        "SUCCESS_RESPONSE_EXISTS",
        block.includes(
            "success: true"
        )
    ],
    [
        "NO_ADMINISTRATOR_EMAIL_EXPOSED",
        !block.includes(
            "administratorEmail"
        ) &&
        !block.includes(
            "adminEmail"
        )
    ],
    [
        "NO_ADMINISTRATOR_UID_EXPOSED",
        !block.includes(
            "administratorUid"
        )
    ],
    [
        "NO_OFFICIAL_PHONE_EXPOSED",
        !block.includes(
            "coopPhone"
        )
    ],
    [
        "NO_SUBSCRIPTION_PLAN_EXPOSED",
        !block.includes(
            "subscriptionPlan"
        )
    ],
    [
        "NO_CLIENT_DIRECT_FIRESTORE_REQUIRED",
        !fs.readFileSync(
            "js/services/cooperativeDiscoveryService.js",
            "utf8"
        ).includes(
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
        "RC406-D75 PUBLIC COOPERATIVE DISCOVERY RESPONSE AUDIT: FAIL"
    );
    process.exit(1);
}

console.log(
    "RC406-D75 PUBLIC COOPERATIVE DISCOVERY RESPONSE AUDIT: PASS"
);
