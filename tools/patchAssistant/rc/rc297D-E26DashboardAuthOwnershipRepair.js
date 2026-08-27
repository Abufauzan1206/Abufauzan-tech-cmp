import fs from "fs";

const file = "js/cooperative-admin.js";
const original = fs.readFileSync(file, "utf8");

const oldBlock = `handleDashboardHistoryReentry();

buildAuthenticatedSidebar("sidebarMenu");

onAuthStateChanged(auth, async (user) => {`;

const newBlock = `handleDashboardHistoryReentry();

onAuthStateChanged(auth, async (user) => {`;

if (!original.includes(oldBlock)) {
    throw new Error(
        "RC297D-E26: Expected duplicate Cooperative Admin sidebar initialization block was not found."
    );
}

const patched = original.replace(oldBlock, newBlock);

fs.writeFileSync(file, patched);

console.log("================================================");
console.log("RC297D-E26 — PATCH APPLIED");
console.log("Cooperative Admin dashboard auth ownership repaired.");
console.log("Removed duplicate dashboard-level sidebar auth initialization.");
console.log("Sidebar remains owned by its authenticated auth listener.");
console.log("================================================");
