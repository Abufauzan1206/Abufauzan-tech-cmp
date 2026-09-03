import fs from "fs";

const membersPath =
    "modules/members/index.html";

const dashboardPath =
    "modules/members/dashboard/app.js";

const accessPath =
    "js/controllers/accessController.js";

const members =
    fs.readFileSync(
        membersPath,
        "utf8"
    );

const dashboard =
    fs.readFileSync(
        dashboardPath,
        "utf8"
    );

const access =
    fs.readFileSync(
        accessPath,
        "utf8"
    );

const checks = [
    [
        "MEMBERS_MODULE_EXISTS",
        members.length > 0
    ],
    [
        "MEMBERS_DASHBOARD_EXISTS",
        dashboard.length > 0
    ],
    [
        "CENTRAL_ACCESS_CONTROLLER_EXISTS",
        access.length > 0
    ],
    [
        "CENTRAL_ENFORCEMENT_EXISTS",
        access.includes(
            "enforceDashboardAccess"
        )
    ],
    [
        "COOPERATIVE_ADMIN_ROLE_EXISTS",
        access.includes(
            "cooperative_admin"
        )
    ],
    [
        "MEMBERS_MODULE_HAS_REVIEW_LINK",
        members.includes(
            "membership-applications/index.html"
        )
    ],
    [
        "DASHBOARD_HAS_NO_PUBLIC_MEMBER_SUBMISSION",
        !dashboard.includes(
            "submitMembershipApplication"
        )
    ],
    [
        "DASHBOARD_HAS_NO_MEMBER_CREATION_BYPASS",
        !dashboard.includes(
            "registerMember"
        ) &&
        !dashboard.includes(
            "CMPMemberEngine.register("
        )
    ],
    [
        "DASHBOARD_HAS_NO_DIRECT_FIRESTORE",
        !dashboard.includes(
            "getFirestore"
        ) &&
        !dashboard.includes(
            "collection("
        ) &&
        !dashboard.includes(
            "doc("
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
        "RC406-D91 MEMBERS MODULE ACCESS ENFORCEMENT TRACE: FAIL"
    );
    process.exit(1);
}

console.log(
    "RC406-D91 MEMBERS MODULE ACCESS ENFORCEMENT TRACE: PASS"
);