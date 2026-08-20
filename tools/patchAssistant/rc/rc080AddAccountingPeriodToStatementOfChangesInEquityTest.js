/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC Patch #080
 *
 * File: rc080AddAccountingPeriodToStatementOfChangesInEquityTest.js
 * Version: 1.0.0
 *
 * Add canonical Financial Year and Accounting Period
 * setup to Statement of Changes in Equity test.
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path:
            "testStatementOfChangesInEquity.js",

        mode: "exact",

        search:
`import {
    seedChartOfAccounts
} from "./js/seeders/chartOfAccountsSeeder.js";`,

        replace:
`import {
    seedChartOfAccounts
} from "./js/seeders/chartOfAccountsSeeder.js";

import {
    createPeriod
} from "./js/business/accountingPeriodEngine.js";

import {
    createYear
} from "./js/business/financialYearEngine.js";`
    },

    {
        path:
            "testStatementOfChangesInEquity.js",

        mode: "exact",

        search:
`await seedChartOfAccounts();`,

        replace:
`await seedChartOfAccounts();

const financialYear = await createYear({
    name:
        "FY 2026 Statement of Changes in Equity Test",
    startDate:
        "2026-01-01T00:00:00.000Z",
    endDate:
        "2026-12-31T23:59:59.999Z"
});

await createPeriod({
    name:
        "2026 Statement of Changes in Equity Test",
    financialYearId:
        financialYear.id,
    startDate:
        "2026-01-01T00:00:00.000Z",
    endDate:
        "2026-12-31T23:59:59.999Z"
});`
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
        "RC080 - ADD ACCOUNTING PERIOD TO STATEMENT OF CHANGES IN EQUITY TEST"
    );

    console.log(
        "========================================="
    );

    const result =
        await transaction(patches);

    console.log(
        "RC080 TRANSACTION RESULT:"
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
            "RC080 PATCH FAIL"
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
        "RC080 PATCH COMPLETE"
    );

    console.log(
        "========================================="
    );
}

run();
