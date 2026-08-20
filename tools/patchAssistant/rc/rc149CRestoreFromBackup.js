/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC149C - RESTORE RC149 FROM PATCH ENGINE BACKUP
 *
 * =====================================================
 */

import fs from "fs";
import { transaction } from "../patchEngine.js";

const backup = "tools/patchAssistant/rc/rc149ProtectedDashboardAuthorizationPersistence.js.bak";
const target = "tools/patchAssistant/rc/rc149ProtectedDashboardAuthorizationPersistence.js";

const backupContent = fs.readFileSync(backup, "utf8");

const patches = [
    {
        path: target,
        mode: "text",
        search: fs.readFileSync(target, "utf8"),
        replace: backupContent
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC149C - RESTORE RC149 FROM BACKUP");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC149C TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;
        console.log("=========================================");
        console.log("RC149C PATCH FAIL");
        console.log("=========================================");
        return;
    }

    console.log("=========================================");
    console.log("RC149C RESTORE COMPLETE");
    console.log("=========================================");

    console.log("Running RC149...");
    console.log("=========================================");

    const { spawnSync } = await import("child_process");

    const test = spawnSync(
        "node",
        [
            "tools/patchAssistant/rc/rc149ProtectedDashboardAuthorizationPersistence.js"
        ],
        {
            stdio: "inherit"
        }
    );

    process.exitCode = test.status ?? 1;
}

run();
