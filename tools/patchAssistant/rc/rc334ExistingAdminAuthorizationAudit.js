import fs from "fs";

const candidates = [
    "super-admin.html",
    "cooperative-admin.html",
    "js/super-admin.js",
    "js/cooperative-admin.js",
    "super-admin.js",
    "cooperative-admin.js",
    "js/auth.js"
];

console.log("===============================================");
console.log("RC334 EXISTING ADMIN AUTHORIZATION AUDIT");
console.log("===============================================");

for (const file of candidates) {
    if (!fs.existsSync(file)) {
        continue;
    }

    const content = fs.readFileSync(file, "utf8");

    console.log("");
    console.log(`FILE: ${file}`);
    console.log("-----------------------------------------------");

    const signals = [
        "auth.currentUser",
        "onAuthStateChanged",
        "getIdTokenResult",
        "doc(db, \"users\", user.uid)",
        "rolesMatch",
        "normalizeRole",
        "superAdmin",
        "super_admin",
        "cooperativeAdmin",
        "cooperative_admin",
        "requireAuth",
        "requireRole",
        "redirect",
        "login.html"
    ];

    for (const signal of signals) {
        console.log(
            `${signal}: ${content.includes(signal) ? "PRESENT" : "ABSENT"}`
        );
    }

    console.log("");
    console.log("----- AUTHORIZATION LINES -----");

    const lines = content.split("\n");

    lines.forEach((line, index) => {
        if (
            /onAuthStateChanged|auth\.currentUser|getIdTokenResult|rolesMatch|normalizeRole|super_admin|cooperative_admin|requireAuth|requireRole|login\.html|redirect/i.test(
                line
            )
        ) {
            console.log(`${index + 1}: ${line.trim()}`);
        }
    });
}

console.log("");
console.log("===============================================");
console.log("RC334 CONTRACT DECISION");
console.log("===============================================");

const existingFiles = candidates.filter(fs.existsSync);

if (!existingFiles.length) {
    console.log(
        "RC334 FINDING: NO EXISTING ADMIN AUTHORIZATION FILE FOUND."
    );
    console.log(
        "RC334 STATUS: REVIEW REQUIRED."
    );
} else {
    console.log(
        "RC334 FINDING: EXISTING ADMIN AUTHORIZATION IMPLEMENTATION LOCATED."
    );
    console.log(
        "RC334 STATUS: REUSE EXISTING AUTHORIZATION CONTRACT; DO NOT CREATE A NEW ROLE SYSTEM."
    );
}

console.log("");
console.log("===============================================");
console.log("RC334 AUDIT COMPLETE");
console.log("===============================================");
console.log("RC334: NO FILES MODIFIED");
