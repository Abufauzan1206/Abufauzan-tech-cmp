import { CMPTransactionEngine } from "./js/business/transactionEngine.js";
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
}

// Create a sample transaction
await CMPTransactionEngine.create({

    type: "CONTRIBUTION",

    amount: 10000,

    description: "Monthly Contribution"

});

// Generate Closing Journal
const report =
    await CMPClosingJournalEngine.generate();

console.log("");

console.log("=========================================");
console.log(" ABUFAUZAN TECH CMP");
console.log(" CLOSING JOURNAL");
console.log("=========================================");

console.log("");

console.log("Current Surplus:", report.surplus);

console.log("");

console.table(report.entries);

console.log("");

console.log("Generated At:", report.generatedAt);

if (Number(report.surplus) !== 10000) {

    throw new Error(
        `Expected closing surplus of 10000, received ${report.surplus}`
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
        `Expected Contribution Income debit of 10000, received ${incomeEntry.debit}`
    );

}

if (Number(capitalEntry.credit) !== 10000) {

    throw new Error(
        `Expected Members Capital credit of 10000, received ${capitalEntry.credit}`
    );

}

console.log("");
console.log("RC081 CLOSING JOURNAL TEST: PASS");

console.log("=========================================");
