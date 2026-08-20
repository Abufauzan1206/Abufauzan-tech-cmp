/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC113.1 - ENFORCE IMMUTABLE BUDGET FINANCIAL-YEAR
 * ASSOCIATION
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "js/business/budgetEngine.js",
        mode: "regex",
        search: `(export async function modifyBudget\\([\\s\\S]*?)(return await updateBudget\\(\\s*id,\\s*data\\s*\\);)`,
        replace: `$1if (
        data?.financialYearId !== undefined &&
        data.financialYearId !== budget.financialYearId
    ) {
        throw new Error(
            "Budget financial year cannot be changed after creation."
        );
    }

    $2`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC113.1 - ENFORCE IMMUTABLE BUDGET FINANCIAL-YEAR ASSOCIATION");
    console.log("=========================================");

    try {
        const result = await transaction(patches);

        console.log("RC113.1 PATCH TRANSACTION RESULT:");
        console.log(JSON.stringify(result, null, 2));

        if (!result.success) {
            process.exitCode = 1;
            console.log("=========================================");
            console.log("RC113.1 PATCH FAIL");
            console.log("=========================================");
            return;
        }

        console.log("=========================================");
        console.log("RC113.1 PATCH COMPLETE");
        console.log("=========================================");

    } catch (error) {
        console.error("RC113.1 PATCH ERROR");
        console.error(error.message);
        process.exitCode = 1;
    }
}

run();
