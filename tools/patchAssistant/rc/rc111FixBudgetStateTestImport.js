/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC111 - FIX RC110 BUDGET STATE TEST IMPORT
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "testBudgetLifecycleEngine.js",
        mode: "regex",
        search: `import \\{\\s*createNewBudget,\\s*closeBudget,\\s*lockBudget,\\s*unlockBudget,\\s*reopenBudget,\\s*modifyBudget,\\s*removeBudget\\s*\\} from "\\./js/business/budgetEngine\\.js";`,
        replace: `import {
    createNewBudget,
    findBudgetById,
    closeBudget,
    lockBudget,
    unlockBudget,
    reopenBudget,
    modifyBudget,
    removeBudget
} from "./js/business/budgetEngine.js";`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC111 - FIX RC110 BUDGET STATE TEST IMPORT");
    console.log("=========================================");

    try {
        const result = await transaction(patches);

        console.log("RC111 PATCH TRANSACTION RESULT:");
        console.log(JSON.stringify(result, null, 2));

        if (!result.success) {
            process.exitCode = 1;
            console.log("=========================================");
            console.log("RC111 PATCH FAIL");
            console.log("=========================================");
            return;
        }

        console.log("=========================================");
        console.log("RC111 PATCH COMPLETE");
        console.log("=========================================");

    } catch (error) {
        console.error("RC111 PATCH ERROR");
        console.error(error.message);
        process.exitCode = 1;
    }
}

run();
