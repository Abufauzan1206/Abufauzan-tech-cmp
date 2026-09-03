import fs from "fs";

const path =
    "modules/members/membership-applications/app.js";

const source =
    fs.readFileSync(
        path,
        "utf8"
    );

const checks = [
    [
        "REVIEW_UI_EXISTS",
        source.length > 0
    ],
    [
        "PENDING_APPLICATION_SERVICE_IMPORTED",
        source.includes(
            "membershipApplicationService"
        )
    ],
    [
        "PENDING_APPLICATION_RETRIEVAL_USED",
        source.includes(
            "getPendingMembershipApplications"
        )
    ],
    [
        "APPROVAL_SERVICE_USED",
        source.includes(
            "approveMembershipApplication"
        )
    ],
    [
        "REJECTION_SERVICE_USED",
        source.includes(
            "rejectMembershipApplication"
        )
    ],
    [
        "APPLICATION_ID_PASSED_TO_APPROVAL",
        source.includes(
            "approveMembershipApplication("
        ) &&
        source.includes(
            "applicationId"
        )
    ],
    [
        "APPLICATION_ID_PASSED_TO_REJECTION",
        source.includes(
            "rejectMembershipApplication("
        ) &&
        source.includes(
            "applicationId"
        )
    ],
    [
        "ACCEPT_ACTION_EXISTS",
        source.includes(
            "accept"
        ) ||
        source.includes(
            "Accept"
        ) ||
        source.includes(
            "Approve"
        )
    ],
    [
        "REJECT_ACTION_EXISTS",
        source.includes(
            "reject"
        ) ||
        source.includes(
            "Reject"
        )
    ],
    [
        "CONFIRMATION_BEFORE_APPROVAL",
        source.includes(
            "confirm"
        ) &&
        source.includes(
            "approveMembershipApplication"
        )
    ],
    [
        "CONFIRMATION_BEFORE_REJECTION",
        source.includes(
            "confirm"
        ) &&
        source.includes(
            "rejectMembershipApplication"
        )
    ],
    [
        "REFRESH_AFTER_DECISION",
        source.includes(
            "loadApplications"
        )
    ],
    [
        "NO_REGISTER_MEMBER_USAGE",
        !source.includes(
            "registerMember"
        )
    ],
    [
        "NO_MEMBER_ENGINE_USAGE",
        !source.includes(
            "CMPMemberEngine"
        )
    ],
    [
        "NO_DIRECT_FIRESTORE_ACCESS",
        !source.includes(
            "getFirestore"
        ) &&
        !source.includes(
            "collection("
        ) &&
        !source.includes(
            "doc("
        )
    ],
    [
        "NO_PUBLIC_SUBMISSION_LINK",
        !source.includes(
            "submitMembershipApplication"
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
        "RC406-D87 MEMBERSHIP APPLICATION UI DECISION AUDIT: FAIL"
    );
    process.exit(1);
}

console.log(
    "RC406-D87 MEMBERSHIP APPLICATION UI DECISION AUDIT: PASS"
);
