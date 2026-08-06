/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC Patch #002
 *
 * File: rc002ClosingJournalAsyncUpgradePatch.js
 * Version: 1.0.0
 *
 * Closing Journal Async Upgrade Patch
 * =====================================================
 */

import { patch } from "../patchEngine.js";

const file =
    "js/business/closingJournalEngine.js";

async function run() {

    console.log(
        "========================================="
    );

    console.log(
        "ABUFAUZAN TECH CMP"
    );

    console.log(
        "RC002 - CLOSING JOURNAL ASYNC UPGRADE"
    );

    console.log(
        "========================================="
    );

    try {

        await patch({
            path: file,
            search:
`import { CMPIncomeExpenditureEngine } from "./incomeExpenditureEngine.js";`,
            replace:
`import {
    generateIncomeExpenditure
} from "./incomeExpenditureEngine.js";`
        });

        await patch({
            path: file,
            search:
`static generate() {`,
            replace:
`static async generate() {`
        });

        await patch({
            path: file,
            search:
`const incomeStatement =
            CMPIncomeExpenditureEngine.generate();`,
            replace:
`const incomeStatement =
            await generateIncomeExpenditure();`
        });

        await patch({
            path: file,
            search:
`const surplus =
            incomeStatement.surplus;`,
            replace:
`const surplus =
            incomeStatement.netSurplus;`
        });

        console.log("PATCH: PASS");

    }
    catch (error) {

        console.log("PATCH FAIL");
        console.log(error.message);

    }

}

run();
