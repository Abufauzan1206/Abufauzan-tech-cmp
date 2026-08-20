/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC099 - CLEAN BASE REPOSITORY TEST OUTPUT
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "testBaseRepository.js",
        mode: "regex",
        search: `\\nconsole\\.log\\("After Delete:"\\);\\s*console\\.log\\(\\s*repository\\.findAll\\(\\)\\s*\\);`,
        replace: ``
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC099 - CLEAN BASE REPOSITORY TEST OUTPUT");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC099 TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC099 PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC099 PATCH COMPLETE");
    console.log("=========================================");
}

run();
