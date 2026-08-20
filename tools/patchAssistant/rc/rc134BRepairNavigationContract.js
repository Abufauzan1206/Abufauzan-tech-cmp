/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC134B - REPAIR NAVIGATION CONTRACT
 *
 * Purpose:
 * Remove the incorrect assumption that the shared
 * navigation menu must contain the Cooperative Admin
 * dashboard destination.
 *
 * The Cooperative Admin dashboard has its own protected
 * entry path and must not be injected into the shared
 * Super Admin navigation merely to satisfy a test.
 *
 * No production files are modified.
 *
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "tools/patchAssistant/test/testProtectedDashboardNavigationGuard.js",
        mode: "regex",
        search: `assert\\(\\s*sidebarSource\\.includes\\("super-admin\\.html"\\)\\s*\\|\\|\\s*menuSource\\.includes\\("super-admin\\.html"\\),\\s*"Navigation configuration contains the Super Admin dashboard destination"\\s*\\);\\s*\\s*assert\\(\\s*sidebarSource\\.includes\\("cooperative-admin\\.html"\\)\\s*\\|\\|\\s*menuSource\\.includes\\("cooperative-admin\\.html"\\),\\s*"Navigation configuration contains the Cooperative Admin dashboard destination"\\s*\\);`,
        replace: `assert(
    sidebarSource.includes("super-admin.html") ||
    menuSource.includes("super-admin.html"),
    "Navigation configuration contains the Super Admin dashboard destination"
);

assert(
    !menuSource.includes("cooperative-admin.html") &&
    !sidebarSource.includes("cooperative-admin.html"),
    "Shared navigation does not expose a Cooperative Admin dashboard destination"
);`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC134B - REPAIR NAVIGATION CONTRACT");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC134B TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC134B PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC134B PATCH COMPLETE");
    console.log("=========================================");
}

run();
