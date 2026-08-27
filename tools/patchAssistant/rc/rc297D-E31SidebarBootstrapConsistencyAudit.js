import fs from "fs";

console.log("================================================");
console.log("RC297D-E31 — SIDEBAR BOOTSTRAP CONSISTENCY AUDIT");
console.log("================================================");

const cooperativeAdmin = fs.readFileSync(
    "js/cooperative-admin.js",
    "utf8"
);

const layout = fs.readFileSync(
    "js/layout.js",
    "utf8"
);

const sidebar = fs.readFileSync(
    "js/navigation/sidebar.js",
    "utf8"
);

const cooperativeHtml = fs.readFileSync(
    "cooperative-admin.html",
    "utf8"
);

const superAdminHtml = fs.readFileSync(
    "super-admin.html",
    "utf8"
);

if (!cooperativeAdmin.includes(
    'import { buildAuthenticatedSidebar } from "./navigation/sidebar.js";'
)) {
    throw new Error(
        "RC297D-E31: Expected Cooperative Admin sidebar import not found."
    );
}

if (cooperativeAdmin.includes(
    'buildAuthenticatedSidebar("sidebarMenu")'
)) {
    throw new Error(
        "RC297D-E31: Cooperative Admin directly initializes sidebar."
    );
}

if (!layout.includes(
    'buildAuthenticatedSidebar("sidebarMenu")'
)) {
    throw new Error(
        "RC297D-E31: Layout sidebar bootstrap missing."
    );
}

if (!sidebar.includes(
    "export function buildAuthenticatedSidebar"
)) {
    throw new Error(
        "RC297D-E31: Sidebar builder export missing."
    );
}

if (!cooperativeHtml.includes(
    'id="sidebarMenu"'
)) {
    throw new Error(
        "RC297D-E31: Cooperative Admin sidebar container missing."
    );
}

if (!superAdminHtml.includes(
    'id="sidebarMenu"'
)) {
    throw new Error(
        "RC297D-E31: Super Admin sidebar container missing."
    );
}

if (cooperativeHtml.includes('src="js/layout.js"')) {
    throw new Error(
        "RC297D-E31: Cooperative Admin unexpectedly loads layout.js."
    );
}

if (!superAdminHtml.includes('src="js/layout.js"')) {
    throw new Error(
        "RC297D-E31: Super Admin layout bootstrap missing."
    );
}

console.log("");
console.log("=== CONTRACT RESULT ===");
console.log("Cooperative Admin: sidebar import present, direct bootstrap absent.");
console.log("Super Admin: layout bootstrap present.");
console.log("Sidebar builder: exported.");
console.log("Both dashboards: sidebar containers present.");
console.log("Cooperative Admin: layout.js not loaded.");
console.log("");
console.log("================================================");
console.log("RC297D-E31 — AUDIT PASS");
console.log("NO PATCH APPLIED.");
console.log("NO FIREBASE DEPLOYMENT.");
console.log("================================================");
