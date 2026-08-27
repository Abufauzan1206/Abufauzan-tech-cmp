import fs from "fs";

const files = [
    "js/navigation/sidebar.js",
    "js/cooperative-admin.js",
    "modules/member-portal/member-portal.js",
    "js/auth.js"
];

console.log("================================================");
console.log("RC297D-E28 — AUTHENTICATED ENTRY-PATH RUNTIME AUDIT");
console.log("================================================");

for (const file of files) {
    if (!fs.existsSync(file)) {
        throw new Error(`RC297D-E28: Missing expected file: ${file}`);
    }

    const source = fs.readFileSync(file, "utf8");

    console.log("");
    console.log(`=== ${file} ===`);
    console.log(`bytes: ${Buffer.byteLength(source, "utf8")}`);
    console.log(`onAuthStateChanged: ${(source.match(/onAuthStateChanged/g) || []).length}`);
    console.log(`location redirects: ${(source.match(/window\.location\.(href|assign|replace)/g) || []).length}`);
    console.log(`login.html references: ${(source.match(/login\.html/g) || []).length}`);
    console.log(`role checks: ${(source.match(/rolesMatch/g) || []).length}`);
}

const sidebar = fs.readFileSync(
    "js/navigation/sidebar.js",
    "utf8"
);

const cooperativeAdmin = fs.readFileSync(
    "js/cooperative-admin.js",
    "utf8"
);

const memberPortal = fs.readFileSync(
    "modules/member-portal/member-portal.js",
    "utf8"
);

const auth = fs.readFileSync(
    "js/auth.js",
    "utf8"
);

if (!sidebar.includes('new URL("../../login.html", import.meta.url).href')) {
    throw new Error(
        "RC297D-E28: Sidebar module-relative login redirect contract missing."
    );
}

if (sidebar.includes('window.location.href = "login.html";')) {
    throw new Error(
        "RC297D-E28: Legacy sidebar login.html redirect still exists."
    );
}

if (!cooperativeAdmin.includes("onAuthStateChanged")) {
    throw new Error(
        "RC297D-E28: Cooperative Admin authentication listener missing."
    );
}

if (cooperativeAdmin.includes(
    'buildAuthenticatedSidebar("sidebarMenu");'
)) {
    throw new Error(
        "RC297D-E28: Cooperative Admin still contains direct sidebar initialization."
    );
}

if (!memberPortal.includes("rolesMatch")) {
    throw new Error(
        "RC297D-E28: Member Portal role authorization contract missing."
    );
}

if (!auth.includes('rolesMatch(userData.role, "super_admin")')) {
    throw new Error(
        "RC297D-E28: Super Admin role routing contract missing."
    );
}

if (!auth.includes('rolesMatch(userData.role, "cooperative_admin")')) {
    throw new Error(
        "RC297D-E28: Cooperative Admin role routing contract missing."
    );
}

if (!auth.includes('rolesMatch(userData.role, "member")')) {
    throw new Error(
        "RC297D-E28: Member role routing contract missing."
    );
}

console.log("");
console.log("================================================");
console.log("RC297D-E28 — AUDIT PASS");
console.log("Authenticated entry-path contracts are structurally present.");
console.log("NO PATCH APPLIED.");
console.log("NO FIREBASE DEPLOYMENT.");
console.log("================================================");
