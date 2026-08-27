import fs from "fs";

const file = "js/cooperative-admin.js";
const original = fs.readFileSync(file, "utf8");

const oldBlock = `handleDashboardHistoryReentry();

onAuthStateChanged(auth, async (user) => {`;

const newBlock = `handleDashboardHistoryReentry();

buildAuthenticatedSidebar("sidebarMenu");

onAuthStateChanged(auth, async (user) => {`;

if (!original.includes(oldBlock)) {
    throw new Error(
        "RC297D-E17: Expected Cooperative Admin initialization boundary was not found."
    );
}

if (original.includes('buildAuthenticatedSidebar("sidebarMenu");')) {
    throw new Error(
        "RC297D-E17: Sidebar initialization already exists."
    );
}

const patched = original.replace(oldBlock, newBlock);

fs.writeFileSync(file, patched);

console.log("================================================");
console.log("RC297D-E17 — PATCH APPLIED");
console.log("Cooperative Admin sidebar initialization restored.");
console.log("Sidebar remains owned by sidebar.js.");
console.log("No layout.js dependency added.");
console.log("================================================");
