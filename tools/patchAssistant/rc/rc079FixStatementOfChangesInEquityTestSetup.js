/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC Patch #079
 *
 * File: rc079FixStatementOfChangesInEquityTestSetup.js
 * Version: 1.0.0
 *
 * Align Statement of Changes in Equity test with the
 * canonical financial test setup.
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [

    {
        path:
            "testStatementOfChangesInEquity.js",

        mode: "exact",

        search:
`import { CMPTransactionEngine } from "./js/business/transactionEngine.js";
import { CMPStatementOfChangesInEquityEngine } from "./js/business/statementOfChangesInEquityEngine.js";`,

        replace:
`import { CMPTransactionEngine } from "./js/business/transactionEngine.js";
import { CMPStatementOfChangesInEquityEngine } from "./js/business/statementOfChangesInEquityEngine.js";
import {
    seedChartOfAccounts
} from "./js/seeders/chartOfAccountsSeeder.js";

await seedChartOfAccounts();`
    },

    {
        path:
            "testStatementOfChangesInEquity.js",

        mode: "exact",

        search:
`CMPTransactionEngine.create({`,

        replace:
`await CMPTransactionEngine.create({`
    },

    {
        path:
            "testStatementOfChangesInEquity.js",

        mode: "exact",

        search:
`console.log("Closing Equity   :", report.closingEquity);
console.log("=========================================");`,

        replace:
`console.log("Closing Equity   :", report.closingEquity);

if (report.currentSurplus !== 10000) {

    throw new Error(
        \`Expected current surplus of 10000, received \${report.currentSurplus}\`
    );

}

if (report.closingEquity !== 70000) {

    throw new Error(
        \`Expected closing equity of 70000, received \${report.closingEquity}\`
    );

}

console.log("");
console.log("STATEMENT OF CHANGES IN EQUITY TEST: PASS");

console.log("=========================================");`
    }

];

async function run() {

    console.log(
        "========================================="
    );

    console.log(
        "ABUFAUZAN TECH CMP"
    );

    console.log(
        "RC079 - FIX STATEMENT OF CHANGES IN EQUITY TEST SETUP"
    );

    console.log(
        "========================================="
    );

    const result =
        await transaction(patches);

    console.log(
        "RC079 TRANSACTION RESULT:"
    );

    console.log(
        JSON.stringify(result, null, 2)
    );

    if (!result.success) {

        process.exitCode = 1;

        console.log(
            "========================================="
        );

        console.log(
            "RC079 PATCH FAIL"
        );

        console.log(
            "========================================="
        );

        return;
    }

    console.log(
        "========================================="
    );

    console.log(
        "RC079 PATCH COMPLETE"
    );

    console.log(
        "========================================="
    );
}

run();
