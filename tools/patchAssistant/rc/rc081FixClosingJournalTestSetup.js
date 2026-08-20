/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC Patch #081
 *
 * File: rc081FixClosingJournalTestSetup.js
 * Version: 1.0.0
 *
 * Align Closing Journal test with the canonical
 * financial test setup and asynchronous APIs.
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [

    {
        path:
            "testClosingJournal.js",

        mode: "exact",

        search:
`import { CMPTransactionEngine } from "./js/business/transactionEngine.js";
import { CMPClosingJournalEngine } from "./js/business/closingJournalEngine.js";`,

        replace:
`import { CMPTransactionEngine } from "./js/business/transactionEngine.js";
import { CMPClosingJournalEngine } from "./js/business/closingJournalEngine.js";
import {
    seedChartOfAccounts
} from "./js/seeders/chartOfAccountsSeeder.js";
import {
    createYear
} from "./js/business/financialYearEngine.js";
import {
    createPeriod
} from "./js/business/accountingPeriodEngine.js";

await seedChartOfAccounts();

const financialYear =
    await createYear({
        name:
            "FY 2026 Closing Journal Test",
        startDate:
            "2026-01-01T00:00:00.000Z",
        endDate:
            "2026-12-31T23:59:59.999Z"
    });

if (
    !financialYear ||
    financialYear.success !== true
) {
    throw new Error(
        "Financial year creation failed."
    );
}

const period =
    await createPeriod({
        name:
            "2026 Closing Journal Test",
        financialYearId:
            financialYear.id,
        startDate:
            "2026-01-01T00:00:00.000Z",
        endDate:
            "2026-12-31T23:59:59.999Z"
    });

if (
    !period ||
    period.success !== true
) {
    throw new Error(
        "Accounting period creation failed."
    );
}`

    },

    {
        path:
            "testClosingJournal.js",

        mode: "exact",

        search:
`CMPTransactionEngine.create({`,

        replace:
`await CMPTransactionEngine.create({`
    },

    {
        path:
            "testClosingJournal.js",

        mode: "exact",

        search:
`const report = CMPClosingJournalEngine.generate();`,

        replace:
`const report =
    await CMPClosingJournalEngine.generate();`
    },

    {
        path:
            "testClosingJournal.js",

        mode: "exact",

        search:
`console.log("Generated At:", report.generatedAt);

console.log("=========================================");`,

        replace:
`console.log("Generated At:", report.generatedAt);

if (Number(report.surplus) !== 10000) {

    throw new Error(
        \`Expected closing surplus of 10000, received \${report.surplus}\`
    );

}

if (
    !Array.isArray(report.entries) ||
    report.entries.length !== 2
) {

    throw new Error(
        "Expected exactly two closing journal entries."
    );

}

const incomeEntry =
    report.entries.find(
        entry =>
            entry.account === "Contribution Income"
    );

const capitalEntry =
    report.entries.find(
        entry =>
            entry.account === "Members Capital"
    );

if (!incomeEntry) {

    throw new Error(
        "Contribution Income closing entry not found."
    );

}

if (!capitalEntry) {

    throw new Error(
        "Members Capital closing entry not found."
    );

}

if (Number(incomeEntry.debit) !== 10000) {

    throw new Error(
        \`Expected Contribution Income debit of 10000, received \${incomeEntry.debit}\`
    );

}

if (Number(capitalEntry.credit) !== 10000) {

    throw new Error(
        \`Expected Members Capital credit of 10000, received \${capitalEntry.credit}\`
    );

}

console.log("");
console.log("RC081 CLOSING JOURNAL TEST: PASS");

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
        "RC081 - FIX CLOSING JOURNAL TEST SETUP"
    );

    console.log(
        "========================================="
    );

    try {

        const result =
            await transaction(patches);

        console.log(
            "RC081 TRANSACTION RESULT:"
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
                "RC081 PATCH FAIL"
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
            "RC081 PATCH COMPLETE"
        );

        console.log(
            "========================================="
        );

    } catch (error) {

        process.exitCode = 1;

        console.log(
            "========================================="
        );

        console.log(
            "RC081 PATCH ERROR"
        );

        console.log(
            error.message
        );

        console.log(
            "========================================="
        );

    }

}

run();
