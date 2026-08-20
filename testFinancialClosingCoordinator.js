import { CMPTransactionEngine } from "./js/business/transactionEngine.js";
import { createPeriod } from "./js/business/accountingPeriodEngine.js";
import { seedChartOfAccounts } from "./js/seeders/chartOfAccountsSeeder.js";
import { createYear } from "./js/business/financialYearEngine.js";
import { CMPFinancialClosingCoordinator } from "./js/business/financialClosingCoordinator.js";

await seedChartOfAccounts();

const financialYear =
    await createYear({
        name: "FY 2026 RC",
        startDate: "2026-01-01",
        endDate: "2026-12-31"
});

const accountingPeriod = await createPeriod({
    name: "August 2026",
    financialYearId: financialYear.id,
    startDate: "2026-01-01",
    endDate: "2026-12-31"
});

await CMPTransactionEngine.create({
    type: "CONTRIBUTION",
    amount: 10000,
    description: "Monthly Contribution"
});

const report =
    await CMPFinancialClosingCoordinator.close(
        financialYear.id,
        2026
    );


console.log("");

console.log("=========================================");
console.log(" ABUFAUZAN TECH CMP");
console.log(" FINANCIAL CLOSING COORDINATOR");
console.log("=========================================");

console.log("");

console.log("Year:", report.year);

console.log("Status:", report.status);

console.log("");

console.log(
    "Trial Balance Balanced:",
    report.trialBalance.balanced
);

console.log("");

console.log(
    "Period Lock:",
    report.periodLock.status
);

console.log("");

console.log(
    "Financial Year:",
    report.financialYear.status
);

console.log("");

console.log(
    "Audit Action:",
    report.audit.action
);

if (report.year !== 2026) {
    throw new Error(
        `Expected closing year 2026, received ${report.year}`
    );
}

if (report.status !== "CLOSED") {
    throw new Error(
        `Expected closing status CLOSED, received ${report.status}`
    );
}

if (!report.trialBalance || report.trialBalance.balanced !== true) {
    throw new Error(
        "Trial Balance verification failed."
    );
}

if (
    !report.closingJournal ||
    !Array.isArray(report.closingJournal.entries)
) {
    throw new Error(
        "Closing journal was not generated correctly."
    );
}

if (
    !report.closingPosting ||
    report.closingPosting.success !== true
) {
    throw new Error(
        "Closing journal was not posted successfully."
    );
}

if (
    !report.openingBalance ||
    !Array.isArray(report.openingBalance.openingBalances)
) {
    throw new Error(
        "Opening balance generation failed."
    );
}

if (
    !Array.isArray(report.openingEntries) ||
    report.openingEntries.length === 0
) {
    throw new Error(
        "Opening balance entries were not generated."
    );
}

if (
    !report.nextFinancialYear ||
    report.nextFinancialYear.success !== true
) {
    throw new Error(
        "Next financial year was not created."
    );
}

if (
    !report.nextAccountingPeriod ||
    report.nextAccountingPeriod.success !== true
) {
    throw new Error(
        "Next accounting period was not created."
    );
}

if (
    !report.openingPosting ||
    report.openingPosting.success !== true
) {
    throw new Error(
        "Opening balance journal was not posted successfully."
    );
}

if (
    !report.periodLock ||
    report.periodLock.status !== "LOCKED"
) {
    throw new Error(
        "Accounting period lock verification failed."
    );
}

if (
    !report.financialYear ||
    report.financialYear.status !== "CLOSED"
) {
    throw new Error(
        "Financial year was not persisted as CLOSED."
    );
}

if (
    !report.audit ||
    report.audit.action !== "YEAR_CLOSE"
) {
    throw new Error(
        "YEAR_CLOSE audit action was not recorded."
    );
}

console.log("Year Verification: PASS");
console.log("Closing Journal Generation: PASS");
console.log("Closing Journal Posting: PASS");
console.log("Opening Balance Generation: PASS");
console.log("Opening Entries: PASS");
console.log("Next Financial Year: PASS");
console.log("Next Accounting Period: PASS");
console.log("Opening Journal Posting: PASS");
console.log("Period Lock Verification: PASS");
console.log("Financial Year Close Verification: PASS");
console.log("YEAR_CLOSE Audit Verification: PASS");

import {
    getAllFinancialYears
} from "./js/services/financialYearService.js";

import {
    getAllAccountingPeriods
} from "./js/services/accountingPeriodService.js";

import {
    findJournalByReference
} from "./js/services/journalService.js";

import {
    findLedgerBatchByJournalReference
} from "./js/services/ledgerBatchService.js";

const persistedYears =
    await getAllFinancialYears();

const persistedPeriods =
    await getAllAccountingPeriods();

const closedYear =
    persistedYears.find(
        item =>
            item.id === financialYear.id
    );

if (
    !closedYear ||
    closedYear.status !== "CLOSED"
) {
    throw new Error(
        "2026 financial year was not persisted as CLOSED."
    );
}

const closedPeriod =
    persistedPeriods.find(
        item =>
            item.name === "August 2026" &&
            item.financialYearId === financialYear.id
    );

if (
    !closedPeriod ||
    closedPeriod.status !== "LOCKED" ||
    closedPeriod.locked !== true
) {
    throw new Error(
        "2026 accounting period was not persisted as LOCKED."
    );
}

const persistedNextYear =
    persistedYears.find(
        item =>
            item.name === "Financial Year 2027"
    );

if (
    !persistedNextYear ||
    persistedNextYear.status !== "OPEN"
) {
    throw new Error(
        "2027 financial year was not persisted as OPEN."
    );
}

const persistedNextPeriod =
    persistedPeriods.find(
        item =>
            item.name === "Accounting Period 2027" &&
            item.financialYearId === persistedNextYear.id
    );

if (
    !persistedNextPeriod ||
    persistedNextPeriod.status !== "OPEN" ||
    persistedNextPeriod.locked === true
) {
    throw new Error(
        "2027 accounting period was not persisted as OPEN."
    );
}

const openingJournal =
    await findJournalByReference(
        "OPENING-BALANCE-2027"
    );

if (!openingJournal) {
    throw new Error(
        "Opening balance journal was not persisted."
    );
}

const openingLedgerBatch =
    await findLedgerBatchByJournalReference(
        "OPENING-BALANCE-2027"
    );

if (!openingLedgerBatch) {
    throw new Error(
        "Opening balance ledger batch was not persisted."
    );
}

if (
    openingLedgerBatch.financialYearId !==
    persistedNextYear.id
) {
    throw new Error(
        "Opening ledger batch financial year context is incorrect."
    );
}

if (
    openingLedgerBatch.accountingPeriodId !==
    persistedNextPeriod.id
) {
    throw new Error(
        "Opening ledger batch accounting period context is incorrect."
    );
}

console.log(
    "2026 Financial Year Persistence: PASS"
);

console.log(
    "2026 Accounting Period Persistence: PASS"
);

console.log(
    "2027 Financial Year Persistence: PASS"
);

console.log(
    "2027 Accounting Period Persistence: PASS"
);

console.log(
    "Opening Journal Persistence: PASS"
);

console.log(
    "Opening Ledger Batch Persistence: PASS"
);

console.log(
    "Opening Ledger Financial Year Context: PASS"
);

console.log(
    "Opening Ledger Accounting Period Context: PASS"
);

console.log("");

console.log("=========================================");

