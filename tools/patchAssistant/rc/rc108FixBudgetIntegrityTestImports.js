/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC108 - FIX BUDGET INTEGRITY TEST IMPORTS
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "testBudgetLifecycleEngine.js",
        mode: "regex",
        search: `import \\{\\s*createYear\\s*\\} from "\\./js/business/financialYearEngine\\.js";`,
        replace: `import {
    createYear,
    closeYear,
    lockYear
} from "./js/business/financialYearEngine.js";`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC108 - FIX BUDGET INTEGRITY TEST IMPORTS");
    console.log("=========================================");

    try {
        const result = await transaction(patches);

        console.log("RC108 PATCH TRANSACTION RESULT:");
        console.log(JSON.stringify(result, null, 2));

        if (!result.success) {
            process.exitCode = 1;
            console.log("=========================================");
            console.log("RC108 PATCH FAIL");
            console.log("=========================================");
            return;
        }

        console.log("=========================================");
        console.log("RC108 PATCH COMPLETE");
        console.log("=========================================");

    } catch (error) {
        console.error("RC108 PATCH ERROR");
        console.error(error.message);
        process.exitCode = 1;
    }
}

run();
