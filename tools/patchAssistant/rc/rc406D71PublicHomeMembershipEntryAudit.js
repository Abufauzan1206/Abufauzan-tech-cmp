import fs from "fs";

const source =
    fs.readFileSync("index.html", "utf8");

const checks = [
    [
        "GET_STARTED_LINK_REMAINS",
        source.includes('href="login.html"')
    ],
    [
        "GET_STARTED_BUTTON_REMAINS",
        source.includes("🚀 Get Started")
    ],
    [
        "REGISTER_COOPERATIVE_LINK_EXISTS",
        source.includes(
            'href="register-cooperative.html"'
        )
    ],
    [
        "REGISTER_COOPERATIVE_LABEL_EXISTS",
        source.includes("🏢 Register Cooperative")
    ],
    [
        "PUBLIC_MEMBERSHIP_LINK_EXISTS",
        source.includes(
            'href="modules/membership-application/index.html"'
        )
    ],
    [
        "PUBLIC_MEMBERSHIP_LABEL_EXISTS",
        source.includes("👤 Apply for Membership")
    ],
    [
        "ADMIN_REVIEW_PAGE_NOT_EXPOSED",
        !source.includes(
            'href="modules/members/membership-applications/index.html"'
        )
    ],
    [
        "PUBLIC_ENTRY_CONTAINER_EXISTS",
        source.includes(
            'class="public-entry-actions"'
        )
    ],
    [
        "NO_DIRECT_FIRESTORE_ACCESS",
        !source.includes("firebase-firestore.js")
    ],
    [
        "NO_MEMBER_CREATION_FLOW_EXPOSED",
        !source.includes(
            'href="modules/member-registration/index.html"'
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
        "RC406-D71 PUBLIC HOME MEMBERSHIP ENTRY AUDIT: FAIL"
    );
    process.exit(1);
}

console.log(
    "RC406-D71 PUBLIC HOME MEMBERSHIP ENTRY AUDIT: PASS"
);
