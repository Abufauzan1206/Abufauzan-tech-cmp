import { seedChartOfAccounts } from "./js/seeders/chartOfAccountsSeeder.js";
import { createPeriod } from "./js/business/accountingPeriodEngine.js";
import { createYear } from "./js/business/financialYearEngine.js";
import { CMPTransactionEngine } from "./js/business/transactionEngine.js";
import { getAllJournals } from "./js/services/journalService.js";
import { getAllLedgerBatches } from "./js/services/ledgerBatchService.js";

const seedResult = await seedChartOfAccounts();

const financialYear = await createYear({
    name: "FY 2026 Financial Core Test",
    startDate: "2026-01-01T00:00:00.000Z",
    endDate: "2026-12-31T23:59:59.999Z"
});

console.log("Chart of Accounts:");
console.log(seedResult);

const periodResult = await createPeriod({
    name: "2026",
        financialYearId: financialYear.id,
        startDate: "2026-01-01T00:00:00.000Z",
        endDate: "2026-12-31T23:59:59.999Z"
});

console.log("Accounting Period:");
console.log(periodResult);

const transaction =
    await CMPTransactionEngine.create({
        type: "CONTRIBUTION",
        amount: 10000,
        description: "Monthly Contribution"
    });

console.log("Transaction:");
console.log(transaction);

console.log("Journals:");
console.log(
    JSON.stringify(
        await getAllJournals(),
        null,
        2
    )
);


console.log("Ledger Batches:");
console.log(
    JSON.stringify(
        await getAllLedgerBatches(),
        null,
        2
    )
);

// -----------------------------------------------------
// Duplicate journal reference protection test
// -----------------------------------------------------
console.log("Duplicate Journal Protection:");

const { CMPJournalPostingEngine } =
    await import("./js/business/journalPostingEngine.js");

try {
    await CMPJournalPostingEngine.post({
        title: "Duplicate Reference Test",
        description: "Duplicate journal reference test",
        date: transaction.transactionDate,
        reference: transaction.transactionId,
        entries: [
            {
                account: "Cash Account",
                debit: 10000,
                credit: 0,
                transactionId: transaction.transactionId
            },
            {
                account: "Contribution Income",
                debit: 0,
                credit: 10000,
                transactionId: transaction.transactionId
            }
        ]
    });

    console.log("FAIL: Duplicate journal reference was posted.");
} catch (error) {
    console.log("PASS:", error.message);
}

// -----------------------------------------------------
// Closed-period protection test
// -----------------------------------------------------

console.log("Closed Period Protection:");

const periodId = periodResult.id;

await import("./js/services/accountingPeriodService.js")
    .then(async ({ updateAccountingPeriod }) => {
        await updateAccountingPeriod(periodId, {
            status: "CLOSED",
            closedAt: new Date().toISOString(),
            closedBy: "TEST"
        });
    });

try {
    await CMPTransactionEngine.create({
        type: "CONTRIBUTION",
        amount: 5000,
        description: "Closed Period Test"
    });

    console.log("FAIL: Transaction was posted into a closed period.");
} catch (error) {
    console.log("PASS:", error.message);
}

// -----------------------------------------------------
// Locked-period protection test
// -----------------------------------------------------

console.log("Locked Period Protection:");

await import("./js/services/accountingPeriodService.js")
    .then(async ({ updateAccountingPeriod }) => {
        await updateAccountingPeriod(periodId, {
            status: "OPEN",
            locked: true,
            lockedAt: new Date().toISOString(),
            lockedBy: "TEST"
        });
    });

try {
    await CMPTransactionEngine.create({
        type: "CONTRIBUTION",
        amount: 3000,
        description: "Locked Period Test"
    });

    console.log("FAIL: Transaction was posted into a locked period.");
} catch (error) {
    console.log("PASS:", error.message);
}
