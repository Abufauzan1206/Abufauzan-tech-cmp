/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC162 - FIX RC130 LOGIN ROUTING TEST CONTRACT
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "tools/patchAssistant/test/testLoginRoutingIntegration.js",
        mode: "exact",
        search: `assert(
    authSource.includes('rolesMatch') &&
    authSource.includes('"super_admin"'),
    "auth.js uses canonical Super Admin role authorization"
);`,
        replace: `assert(
    authSource.includes('rolesMatch') &&
    authSource.includes('"super_admin"'),
    "auth.js uses canonical Super Admin role authorization"
);`
    },
    {
        path: "tools/patchAssistant/test/testLoginRoutingIntegration.js",
        mode: "exact",
        search: `assert(
    authSource.includes('rolesMatch') &&
    authSource.includes('"cooperative_admin"'),
    "auth.js uses canonical Cooperative Admin role authorization"
);`,
        replace: `assert(
    authSource.includes('rolesMatch') &&
    authSource.includes('"cooperative_admin"'),
    "auth.js uses canonical Cooperative Admin role authorization"
);`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC162 - FIX RC130 LOGIN ROUTING TEST CONTRACT");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC162 TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;
        console.log("=========================================");
        console.log("RC162 PATCH FAIL");
        console.log("=========================================");
        return;
    }

    console.log("=========================================");
    console.log("RC162 PATCH COMPLETE");
    console.log("=========================================");
    console.log("Running RC130 test...");
    console.log("=========================================");

    const { spawnSync } = await import("child_process");

    const test = spawnSync(
        "node",
        [
            "tools/patchAssistant/test/testLoginRoutingIntegration.js"
        ],
        {
            stdio: "inherit"
        }
    );

    process.exitCode = test.status ?? 1;
}

run();
