import fs from "fs";

const source =
    fs.readFileSync(
        "modules/members/index.html",
        "utf8"
    );

const checks = [
    [
        "MEMBERSHIP_APPLICATIONS_LINK_EXISTS",
        source.includes(
            'href="membership-applications/index.html"'
        )
    ],
    [
        "MEMBERSHIP_APPLICATIONS_CARD_EXISTS",
        source.includes(
            '<h3>Membership Applications</h3>'
        )
    ],
    [
        "MEMBERSHIP_APPLICATIONS_DESCRIPTION_EXISTS",
        source.includes(
            "Review pending membership applications."
        )
    ],
    [
        "REGISTER_MEMBER_LINK_REMAINS",
        source.includes(
            'href="../member-registration/index.html"'
        )
    ],
    [
        "REGISTER_MEMBER_CARD_REMAINS",
        source.includes(
            "<h3>Register Member</h3>"
        )
    ],
    [
        "MEMBER_DIRECTORY_LINK_REMAINS",
        source.includes(
            'href="member-directory/index.html"'
        )
    ],
    [
        "MEMBER_DIRECTORY_CARD_REMAINS",
        source.includes(
            "<h3>Member Directory</h3>"
        )
    ],
    [
        "NO_DUPLICATE_APPLICATION_LINK",
        (
            source.match(
                /href="membership-applications\/index\.html"/g
            ) || []
        ).length === 1
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
        "RC406-D70 MEMBERSHIP APPLICATIONS NAVIGATION AUDIT: FAIL"
    );
    process.exit(1);
}

console.log(
    "RC406-D70 MEMBERSHIP APPLICATIONS NAVIGATION AUDIT: PASS"
);
