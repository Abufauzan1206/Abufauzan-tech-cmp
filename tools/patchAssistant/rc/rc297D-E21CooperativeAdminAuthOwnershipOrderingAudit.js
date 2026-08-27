import fs from "fs";

const files = [
    "js/auth.js",
    "js/cooperative-admin.js",
    "js/navigation/sidebar.js",
    "js/firebase-config.js",
    "cooperative-admin.html",
    "super-admin.html"
];

console.log("================================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC297D-E21 — COOPERATIVE ADMIN AUTH OWNERSHIP / REDIRECT ORDERING AUDIT");
console.log("================================================");

for (const file of files) {
    const content = fs.readFileSync(file, "utf8");

    console.log("");
    console.log(`=== ${file} ===`);

    const lines = content.split("\n");

    const authLines = lines
        .map((line, index) => ({
            number: index + 1,
            line
        }))
        .filter(({ line }) =>
            /onAuthStateChanged|signOut|window\.location|auth\.currentUser|buildAuthenticatedSidebar|getDoc|rolesMatch/.test(line)
        );

    for (const { number, line } of authLines) {
        console.log(
            `${String(number).padStart(4, " ")}  ${line}`
        );
    }
}

console.log("");
console.log("=== SCRIPT EXECUTION ORDER ===");

for (const file of [
    "super-admin.html",
    "cooperative-admin.html"
]) {
    const content = fs.readFileSync(file, "utf8");

    console.log("");
    console.log(`--- ${file} ---`);

    const scripts = [
        ...content.matchAll(
            /<script\b[^>]*type=["']module["'][^>]*src=["']([^"']+)["'][^>]*>/gi
        )
    ].map(match => match[1]);

    if (scripts.length === 0) {
        console.log("No module scripts found.");
    } else {
        scripts.forEach((src, index) => {
            console.log(`${index + 1}. ${src}`);
        });
    }
}

console.log("");
console.log("=== OWNERSHIP SIGNALS ===");

const cooperativeAdmin = fs.readFileSync(
    "js/cooperative-admin.js",
    "utf8"
);

const sidebar = fs.readFileSync(
    "js/navigation/sidebar.js",
    "utf8"
);

const auth = fs.readFileSync(
    "js/auth.js",
    "utf8"
);

console.log(
    `auth.js role redirect authority: ${
        /window\.location\.href\s*=\s*"cooperative-admin\.html"/.test(auth)
            ? "PRESENT"
            : "NOT FOUND"
    }`
);

console.log(
    `cooperative-admin.js session authority: ${
        /onAuthStateChanged\s*\(\s*auth/.test(cooperativeAdmin)
            ? "PRESENT"
            : "NOT FOUND"
    }`
);

console.log(
    `sidebar.js session authority: ${
        /onAuthStateChanged\s*\(\s*auth/.test(sidebar)
            ? "PRESENT"
            : "NOT FOUND"
    }`
);

console.log(
    `cooperative-admin.js direct redirect handling: ${
        /window\.location\.href/.test(cooperativeAdmin)
            ? "PRESENT"
            : "NOT FOUND"
    }`
);

console.log(
    `sidebar.js direct redirect handling: ${
        /window\.location\.href/.test(sidebar)
            ? "PRESENT"
            : "NOT FOUND"
    }`
);

console.log("");
console.log("=== AUDIT DECISION ===");
console.log("No patch applied.");
console.log("No Firebase deployment.");
console.log("RC297D-E21 establishes auth ownership and redirect ordering before any race-condition patch.");
console.log("================================================");
console.log("RC297D-E21 — AUDIT COMPLETE");
console.log("NO PATCH APPLIED");
console.log("NO FIREBASE DEPLOYMENT");
console.log("================================================");
