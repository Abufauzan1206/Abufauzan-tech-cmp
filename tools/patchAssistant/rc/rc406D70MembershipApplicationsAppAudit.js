import fs from "fs";

const source =
    fs.readFileSync(
        "modules/members/membership-applications/app.js",
        "utf8"
    );

const checks = [
    [
        "PENDING_SERVICE_IMPORTED",
        source.includes(
            "getPendingMembershipApplications"
        )
    ],
    [
        "APPROVAL_SERVICE_IMPORTED",
        source.includes(
            "approveMembershipApplication"
        )
    ],
    [
        "REJECTION_SERVICE_IMPORTED",
        source.includes(
            "rejectMembershipApplication"
        )
    ],
    [
        "PENDING_APPLICATIONS_LOADED",
        source.includes(
            "await getPendingMembershipApplications()"
        )
    ],
    [
        "APPLICATIONS_RENDERED",
        source.includes(
            "renderApplications()"
        )
    ],
    [
        "PENDING_COUNT_RENDERED",
        source.includes(
            "Pending Applications:"
        )
    ],
    [
        "EMPTY_STATE_EXISTS",
        source.includes(
            "No pending membership applications."
        )
    ],
    [
        "APPROVE_HANDLER_EXISTS",
        source.includes(
            "async function handleApprove(applicationId)"
        )
    ],
    [
        "REJECT_HANDLER_EXISTS",
        source.includes(
            "async function handleReject(applicationId)"
        )
    ],
    [
        "APPROVE_USES_SERVICE",
        source.includes(
            "await approveMembershipApplication("
        )
    ],
    [
        "REJECT_USES_SERVICE",
        source.includes(
            "await rejectMembershipApplication("
        )
    ],
    [
        "APPROVE_CONFIRMATION_EXISTS",
        source.includes(
            "Accept this membership application?"
        )
    ],
    [
        "REJECT_CONFIRMATION_EXISTS",
        source.includes(
            "Reject this membership application?"
        )
    ],
    [
        "APPROVE_REFRESHES_LIST",
        source.includes(
            "Membership application accepted."
        ) &&
        source.includes(
            "await loadApplications();"
        )
    ],
    [
        "REJECT_REFRESHES_LIST",
        source.includes(
            "Membership application rejected."
        ) &&
        source.includes(
            "await loadApplications();"
        )
    ],
    [
        "APPLICATION_ID_BOUND_TO_ACTION",
        source.includes(
            "data-application-id"
        )
    ],
    [
        "ACTION_DELEGATION_EXISTS",
        source.includes(
            'button[data-action]'
        )
    ],
    [
        "BUTTON_DISABLED_DURING_ACTION",
        source.includes(
            "button.disabled = true;"
        )
    ],
    [
        "HTML_ESCAPING_EXISTS",
        source.includes(
            "function escapeHtml(value)"
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
        "RC406-D70 MEMBERSHIP APPLICATIONS APP AUDIT: FAIL"
    );
    process.exit(1);
}

console.log(
    "RC406-D70 MEMBERSHIP APPLICATIONS APP AUDIT: PASS"
);
