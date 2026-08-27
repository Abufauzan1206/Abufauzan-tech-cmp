import fs from "fs";

console.log("================================================");
console.log("RC297D-E32 — AUTHENTICATED SIDEBAR RUNTIME OWNERSHIP AUDIT");
console.log("================================================");

const sidebar = fs.readFileSync(
    "js/navigation/sidebar.js",
    "utf8"
);

const layout = fs.readFileSync(
    "js/layout.js",
    "utf8"
);

const cooperativeAdmin = fs.readFileSync(
    "js/cooperative-admin.js",
    "utf8"
);

const superAdmin = fs.readFileSync(
    "js/super-admin.js",
    "utf8"
);

const memberPortal = fs.readFileSync(
    "modules/member-portal/member-portal.js",
    "utf8"
);

const checks = [
    [
        "Sidebar builder exported",
        sidebar.includes("export function buildAuthenticatedSidebar")
    ],
    [
        "Sidebar builder owns auth listener",
        sidebar.includes("onAuthStateChanged(auth")
    ],
    [
        "Sidebar builder resolves authenticated user",
        sidebar.includes("if (!user)")
    ],
    [
        "Sidebar builder performs role authorization",
        sidebar.includes("rolesMatch")
    ],
    [
        "Sidebar builder populates sidebar",
        sidebar.includes("innerHTML")
    ],
    [
        "Layout invokes authenticated sidebar builder",
        layout.includes('buildAuthenticatedSidebar("sidebarMenu")')
    ],
    [
        "Cooperative Admin does not directly invoke sidebar builder",
        !cooperativeAdmin.includes('buildAuthenticatedSidebar("sidebarMenu")')
    ],
    [
        "Super Admin does not directly invoke sidebar builder",
        !superAdmin.includes('buildAuthenticatedSidebar("sidebarMenu")')
    ],
    [
        "Member Portal does not directly invoke sidebar builder",
        !memberPortal.includes('buildAuthenticatedSidebar("sidebarMenu")')
    ]
];

for (const [label, passed] of checks) {
    console.log(`${passed ? "PASS" : "FAIL"} — ${label}`);

    if (!passed) {
        throw new Error(`RC297D-E32: Contract failure — ${label}`);
    }
}

console.log("");
console.log("=== OWNERSHIP RESULT ===");
console.log("Sidebar runtime authentication ownership: js/navigation/sidebar.js");
console.log("Sidebar bootstrap ownership: js/layout.js");
console.log("Cooperative Admin direct sidebar bootstrap: absent.");
console.log("Super Admin direct sidebar bootstrap: absent.");
console.log("Member Portal direct sidebar bootstrap: absent.");
console.log("");
console.log("================================================");
console.log("RC297D-E32 — AUDIT PASS");
console.log("NO PATCH APPLIED.");
console.log("NO FIREBASE DEPLOYMENT.");
console.log("================================================");
