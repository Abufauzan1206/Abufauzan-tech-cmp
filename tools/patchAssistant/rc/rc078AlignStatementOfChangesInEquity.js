/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC Patch #078
 *
 * File: rc078AlignStatementOfChangesInEquity.js
 * Version: 1.0.0
 *
 * Align Statement of Changes in Equity with the
 * canonical asynchronous Income & Expenditure API.
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [

    {
        path:
            "js/business/statementOfChangesInEquityEngine.js",

        mode: "exact",

        search:
`import { CMPIncomeExpenditureEngine } from "./incomeExpenditureEngine.js";`,

        replace:
`import {
    generateIncomeExpenditure
} from "./incomeExpenditureEngine.js";`
    },

    {
        path:
            "js/business/statementOfChangesInEquityEngine.js",

        mode: "exact",

        search:
`    static generate({`,

        replace:
`    static async generate({`
    },

    {
        path:
            "js/business/statementOfChangesInEquityEngine.js",

        mode: "exact",

        search:
`        const incomeStatement =
            CMPIncomeExpenditureEngine.generate();

        const surplus =
            incomeStatement.surplus;`,

        replace:
`        const incomeStatement =
            await generateIncomeExpenditure();

        const surplus =
            incomeStatement.netSurplus;`
    },

    {
        path:
            "testStatementOfChangesInEquity.js",

        mode: "exact",

        search:
`const report = CMPStatementOfChangesInEquityEngine.generate({`,

        replace:
`const report =
    await CMPStatementOfChangesInEquityEngine.generate({`
    },

    {
        path:
            "testStatementOfChangesInEquity.js",

        mode: "exact",

        search:
`import { CMPTransactionEngine } from "./js/business/transactionEngine.js";
import { CMPStatementOfChangesInEquityEngine } from "./js/business/statementOfChangesInEquityEngine.js";`,

        replace:
`import { CMPTransactionEngine } from "./js/business/transactionEngine.js";
import { CMPStatementOfChangesInEquityEngine } from "./js/business/statementOfChangesInEquityEngine.js";`
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
        "RC078 - ALIGN STATEMENT OF CHANGES IN EQUITY"
    );

    console.log(
        "========================================="
    );

    const result =
        await transaction(patches);

    console.log(
        "RC078 TRANSACTION RESULT:"
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
            "RC078 PATCH FAIL"
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
        "RC078 PATCH COMPLETE"
    );

    console.log(
        "========================================="
    );
}

run();
