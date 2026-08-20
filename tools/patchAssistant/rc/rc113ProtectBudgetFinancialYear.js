/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC113 - PROTECT BUDGET FINANCIAL-YEAR ASSOCIATION
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "js/business/budgetEngine.js",
        mode: "regex",
        search: `\\n\\s*return await updateBudget\\(\\s*id,\\s*data\\s*\\);`,
        replace: `
    if (
        data?.financialYearId !== undefined &&
        data.financialYearId !== budget.financialYearId
    ) {
        throw new Error(
            "Budget financial year cannot be changed after creation."
        );
    }

    return await updateBudget(
        id,
        data
    );`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC113 - PROTECT BUDGET FINANCIAL-YEAR ASSOCIATION");
    console.log("=========================================");

    try {
        const result = await transaction(patches);

        console.log("RC113 PATCH TRANSACTION RESULT:");
        console.log(JSON.stringify(result, null, 2));

        if (!result.success) {
            process.exitCode = 1;
            console.log("=========================================");
            console.log("RC113 PATCH FAIL");
            console.log("=========================================");
            return;
        }

        console.log("=========================================");
        console.log("RC113 PATCH COMPLETE");
        console.log("=========================================");

    } catch (error) {
        console.error("RC113 PATCH ERROR");
        console.error(error.message);
        process.exitCode = 1;
    }
}

run();
