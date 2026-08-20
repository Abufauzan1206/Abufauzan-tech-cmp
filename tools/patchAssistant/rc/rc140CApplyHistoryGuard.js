/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC140C - APPLY PROTECTED DASHBOARD HISTORY GUARD
 *
 * Purpose:
 * Add browser Back/Forward and page re-entry protection
 * to Super Admin and Cooperative Admin dashboards.
 *
 * Production files modified through Patch Engine only.
 *
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "js/super-admin.js",
        mode: "text",
        search: `onAuthStateChanged(auth, async (user) => {`,
        replace: `function handleDashboardHistoryReentry() {
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

onAuthStateChanged(auth, async (user) => {`
    },
    {
        path: "js/cooperative-admin.js",
        mode: "text",
        search: `onAuthStateChanged(auth, async (user) => {`,
        replace: `function handleDashboardHistoryReentry() {
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

onAuthStateChanged(auth, async (user) => {`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC140C - APPLY PROTECTED DASHBOARD HISTORY GUARD");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC140C TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC140C PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC140C PATCH COMPLETE");
    console.log("=========================================");
}

run();
