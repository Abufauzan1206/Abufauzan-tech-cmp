import fs from "fs";

const file = "js/cooperative-admin.js";

const original = fs.readFileSync(file, "utf8");

const oldBlock = `function handleDashboardHistoryReentry() {
    const currentUser = auth.currentUser;

    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }

    window.addEventListener("popstate", () => {
        window.location.reload();
    });

    window.addEventListener("pageshow", (event) => {
        if (event.persisted) {
            window.location.reload();
        }
    });

    window.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
            window.location.reload();
        }
    });
}

handleDashboardHistoryReentry();

buildAuthenticatedSidebar("sidebarMenu");

onAuthStateChanged(auth, async (user) => {`;

const newBlock = `function handleDashboardHistoryReentry() {
    window.addEventListener("popstate", () => {
        window.location.reload();
    });

    window.addEventListener("pageshow", (event) => {
        if (event.persisted) {
            window.location.reload();
        }
    });

    window.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
            window.location.reload();
        }
    });
}

handleDashboardHistoryReentry();

onAuthStateChanged(auth, async (user) => {`;

if (!original.includes(oldBlock)) {
    throw new Error(
        "RC297D-E13: Expected Cooperative Admin auth initialization block was not found."
    );
}

const patched = original.replace(oldBlock, newBlock);

fs.writeFileSync(file, patched);

console.log("================================================");
console.log("RC297D-E13 — PATCH APPLIED");
console.log("Cooperative Admin auth initialization repaired.");
console.log("Removed premature auth.currentUser gate.");
console.log("Removed duplicate sidebar initialization from dashboard startup.");
console.log("================================================");
