import fs from "fs";

const files = [
    "cooperative-admin.html",
    "js/cooperative-admin.js",
    "js/layout.js",
    "js/navigation/sidebar.js"
];

console.log("================================================");
console.log("RC297D-E30 — COOPERATIVE ADMIN SIDEBAR POPULATION TRACE");
console.log("================================================");

for (const file of files) {
    if (!fs.existsSync(file)) {
        throw new Error(`RC297D-E30: Missing expected file: ${file}`);
    }

    const source = fs.readFileSync(file, "utf8");

    console.log("");
    console.log(`=== ${file} ===`);
    console.log(`bytes: ${Buffer.byteLength(source, "utf8")}`);

    for (const pattern of [
        "sidebarMenu",
        "buildAuthenticatedSidebar",
        "innerHTML",
        "insertAdjacentHTML",
        "appendChild",
        "createElement",
        "sidebar"
    ]) {
        const count = (source.match(
            new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")
        ) || []).length;

        console.log(`${pattern}: ${count}`);
    }
}

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

if (cooperativeAdmin.includes('buildAuthenticatedSidebar("sidebarMenu")')) {
    throw new Error(
        "RC297D-E30: Cooperative Admin directly initializes sidebar — ownership regression."
    );
}

if (!layout.includes('buildAuthenticatedSidebar("sidebarMenu")')) {
    throw new Error(
        "RC297D-E30: Layout sidebar initialization contract missing."
    );
}

if (!sidebar.includes("export function buildAuthenticatedSidebar")) {
    throw new Error(
        "RC297D-E30: Sidebar builder export missing."
    );
}

console.log("");
console.log("================================================");
console.log("RC297D-E30 — TRACE PASS");
console.log("No ownership regression detected.");
console.log("NO PATCH APPLIED.");
console.log("NO FIREBASE DEPLOYMENT.");
console.log("================================================");
