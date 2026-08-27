import fs from "fs";

console.log("================================================");
console.log("RC297D-E33 — AUTH LISTENER / REDIRECT COMPETITION AUDIT");
console.log("================================================");

const files = [
    "js/auth.js",
    "js/cooperative-admin.js",
    "js/navigation/sidebar.js",
    "modules/member-portal/member-portal.js",
    "js/super-admin.js"
];

const sources = Object.fromEntries(
    files.map(file => [file, fs.readFileSync(file, "utf8")])
);

for (const file of files) {
    const source = sources[file];

    const listeners =
        (source.match(/onAuthStateChanged\s*\(/g) || []).length;

    const redirects =
        (source.match(/window\.location\.(href|assign|replace)\s*=/g) || []).length;

    console.log("");
    console.log(`=== ${file} ===`);
    console.log(`onAuthStateChanged: ${listeners}`);
    console.log(`location redirects: ${redirects}`);
}

const auth = sources["js/auth.js"];
const cooperative = sources["js/cooperative-admin.js"];
const sidebar = sources["js/navigation/sidebar.js"];
const member = sources["modules/member-portal/member-portal.js"];
const superAdmin = sources["js/super-admin.js"];

if (!auth.includes("rolesMatch") ||
    !auth.includes("window.location.href")) {
    throw new Error(
        "RC297D-E33: Auth entry-routing contract missing."
    );
}

if (!cooperative.includes("onAuthStateChanged(")) {
    throw new Error(
        "RC297D-E33: Cooperative Admin session listener missing."
    );
}

if (!sidebar.includes("onAuthStateChanged(")) {
    throw new Error(
        "RC297D-E33: Sidebar authentication listener missing."
    );
}

if (!member.includes("onAuthStateChanged(")) {
    throw new Error(
        "RC297D-E33: Member Portal session listener missing."
    );
}

console.log("");
console.log("=== COMPETITION AUDIT RESULT ===");
console.log("Authentication consumers identified.");
console.log("Redirect-bearing consumers identified.");
console.log("No ownership modification performed.");
console.log("");
console.log("================================================");
console.log("RC297D-E33 — AUDIT PASS");
console.log("NO PATCH APPLIED.");
console.log("NO FIREBASE DEPLOYMENT.");
console.log("================================================");
