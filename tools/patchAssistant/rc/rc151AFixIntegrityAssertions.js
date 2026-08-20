/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC151A - FIX RC151 INTEGRITY ASSERTIONS
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "tools/patchAssistant/test/testProtectedDashboardAuthorizationIntegrity.js",
        mode: "text",
        search: `check(
    cooperativeAdminSource.includes("rolesMatch(userData.role, \\"cooperative_admin\\")"),
    "Cooperative Admin retains explicit canonical authorization"
);`,
        replace: `check(
    cooperativeAdminSource.includes("rolesMatch(") &&
    cooperativeAdminSource.includes('"cooperative_admin"'),
    "Cooperative Admin retains explicit canonical authorization"
);`
    },
    {
        path: "tools/patchAssistant/test/testProtectedDashboardAuthorizationIntegrity.js",
        mode: "text",
        search: `check(
    superAdminSource.includes("cooperative-admin.html") &&
    cooperativeAdminSource.includes("cooperative-admin.html"),
    "Super Admin retains Cooperative Admin boundary"
);`,
        replace: `check(
    superAdminSource.includes("cooperative-admin.html"),
    "Super Admin retains Cooperative Admin boundary"
);`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC151A - FIX RC151 INTEGRITY ASSERTIONS");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC151A TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;
        console.log("=========================================");
        console.log("RC151A PATCH FAIL");
        console.log("=========================================");
        return;
    }

    console.log("=========================================");
    console.log("RC151A PATCH COMPLETE");
    console.log("=========================================");

    const { spawnSync } = await import("child_process");

    const test = spawnSync(
        "node",
        [
            "tools/patchAssistant/test/testProtectedDashboardAuthorizationIntegrity.js"
        ],
        {
            stdio: "inherit"
        }
    );

    process.exitCode = test.status ?? 1;
}

run();
