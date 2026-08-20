/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC090 - FINANCIAL CLOSING PERSISTENCE VERIFICATION
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "testFinancialClosingCoordinator.js",
        mode: "regex",

        search: `console\\.log\\(
    "YEAR_CLOSE Audit Verification: PASS"
\\);`,

        replace: `console.log(
    "YEAR_CLOSE Audit Verification: PASS"
);

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
);`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC090 - FINANCIAL CLOSING PERSISTENCE VERIFICATION");
    console.log("=========================================");

    const result =
        await transaction(patches);

    console.log("RC090 TRANSACTION RESULT:");

    console.log(
        JSON.stringify(result, null, 2)
    );

    if (!result.success) {
        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC090 PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC090 PATCH COMPLETE");
    console.log("=========================================");
}

run();
