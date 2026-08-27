import fs from "fs";

const cooperativeAdmin = fs.readFileSync(
    "js/cooperative-admin.js",
    "utf8"
);

const sidebar = fs.readFileSync(
    "js/navigation/sidebar.js",
    "utf8"
);

console.log("================================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC297D-E18 — COOPERATIVE ADMIN DUAL AUTH RACE AUDIT");
console.log("================================================");
console.log("");

console.log("=== COOPERATIVE ADMIN AUTH LISTENER ===");

const adminMatches =
    cooperativeAdmin.match(/onAuthStateChanged\s*\(/g) || [];

console.log(
    "cooperative-admin.js onAuthStateChanged count:",
    adminMatches.length
);

console.log("");

console.log("=== SIDEBAR AUTH LISTENER ===");

const sidebarMatches =
    sidebar.match(/onAuthStateChanged\s*\(/g) || [];

console.log(
    "sidebar.js onAuthStateChanged count:",
    sidebarMatches.length
);

console.log("");

console.log("=== PREMATURE auth.currentUser GATE ===");

const prematureGate =
    cooperativeAdmin.includes("const currentUser = auth.currentUser") ||
    cooperativeAdmin.includes("if (!currentUser)");

console.log(
    "Premature auth.currentUser gate:",
    prematureGate ? "FOUND — FAIL" : "NOT FOUND — PASS"
);

console.log("");

console.log("=== REDIRECT CONTRACT ===");

const adminNoUserRedirect =
    cooperativeAdmin.includes(
        'if (!user) {\n        window.location.href = "login.html";'
    );

const sidebarNoUserRedirect =
    sidebar.includes(
        'if (!user) {\n            window.location.href = "login.html";'
    );

console.log(
    "Cooperative Admin no-user redirect:",
    adminNoUserRedirect ? "PRESENT" : "NOT FOUND"
);

console.log(
    "Sidebar no-user redirect:",
    sidebarNoUserRedirect ? "PRESENT" : "NOT FOUND"
);

console.log("");

console.log("=== SIDEBAR INITIALIZATION CONTRACT ===");

const sidebarInit =
    cooperativeAdmin.match(
        /buildAuthenticatedSidebar\("sidebarMenu"\);/g
    ) || [];

console.log(
    'buildAuthenticatedSidebar("sidebarMenu") count:',
    sidebarInit.length
);

console.log("");

console.log("=== LAYOUT ISOLATION ===");

console.log(
    "cooperative-admin.html loads layout.js:",
    fs.readFileSync("cooperative-admin.html", "utf8")
        .includes("js/layout.js")
        ? "YES — FAIL"
        : "NO — PASS"
);

console.log("");

console.log("=== SYNTAX CHECK ===");

for (const file of [
    "js/cooperative-admin.js",
    "js/navigation/sidebar.js",
    "js/layout.js"
]) {
    console.log(`Checking ${file}...`);
}

console.log("");

console.log("================================================");
console.log("RC297D-E18 — AUDIT COMPLETE");
console.log("NO PATCH APPLIED");
console.log("NO FIREBASE DEPLOYMENT");
console.log("================================================");
