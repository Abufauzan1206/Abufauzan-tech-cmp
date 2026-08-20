/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC083 - CLOSING JOURNAL POSTING INTEGRATION
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [

    {
        path: "testClosingJournalPostingIntegration.js",
        mode: "create",
        replace: `import {
    seedChartOfAccounts
} from "./js/seeders/chartOfAccountsSeeder.js";

import {
    createYear
} from "./js/business/financialYearEngine.js";

import {
    createPeriod
} from "./js/business/accountingPeriodEngine.js";

import {
    CMPTransactionEngine
} from "./js/business/transactionEngine.js";

import {
    postClosingJournal
} from "./js/business/closingJournalPostingEngine.js";

import {
    getAllJournals
} from "./js/services/journalService.js";

import {
    CMPRepositoryManager
} from "./js/repositories/repositoryManager.js";


async function run() {

    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC083 - CLOSING JOURNAL POSTING INTEGRATION");
    console.log("=========================================");

    const seed = await seedChartOfAccounts();

    if (!seed || seed.success !== true) {
        throw new Error("Chart of Accounts setup failed.");
    }

    console.log("Chart of Accounts: PASS");

    const financialYear = await createYear({
        name: "FY 2026 RC083 Closing Journal",
        startDate: "2026-01-01T00:00:00.000Z",
        endDate: "2026-12-31T23:59:59.999Z"
    });

    if (!financialYear || financialYear.success !== true) {
        throw new Error("Financial year creation failed.");
    }

    console.log("Financial Year: PASS");

    const period = await createPeriod({
        name: "2026",
        financialYearId: financialYear.id,
        startDate: "2026-01-01T00:00:00.000Z",
        endDate: "2026-12-31T23:59:59.999Z"
    });

    if (!period || period.success !== true) {
        throw new Error("Accounting period creation failed.");
    }

    console.log("Accounting Period: PASS");

    const transaction =
        await CMPTransactionEngine.create({
            type: "CONTRIBUTION",
            amount: 10000,
            description:
                "RC083 Closing Journal Integration Contribution"
        });

    if (
        !transaction ||
        transaction.status !== "POSTED"
    ) {
        throw new Error(
            "Contribution transaction was not posted."
        );
    }

    console.log("Contribution Transaction: PASS");

    const closing =
        await postClosingJournal(
            "2026-12-31"
        );

    if (
        !closing ||
        closing.success !== true
    ) {
        throw new Error(
            "Closing journal posting failed."
        );
    }

    if (
        closing.postingResult?.success !== true
    ) {
        throw new Error(
            "Closing journal posting result was unsuccessful."
        );
    }

    console.log("Closing Journal Posting: PASS");

    if (
        closing.closingJournal?.surplus !== 10000
    ) {
        throw new Error(
            \`Expected closing surplus of 10000, received \${closing.closingJournal?.surplus}\`
        );
    }

    console.log("Closing Surplus: PASS");

    const entries =
        closing.closingJournal.entries;

    if (
        !Array.isArray(entries) ||
        entries.length !== 2
    ) {
        throw new Error(
            "Expected exactly two closing journal entries."
        );
    }

    const incomeEntry =
        entries.find(
            entry =>
                entry.account === "Contribution Income"
        );

    const capitalEntry =
        entries.find(
            entry =>
                entry.account === "Members Capital"
        );

    if (
        !incomeEntry ||
        Number(incomeEntry.debit) !== 10000 ||
        Number(incomeEntry.credit) !== 0
    ) {
        throw new Error(
            "Contribution Income closing entry is incorrect."
        );
    }

    if (
        !capitalEntry ||
        Number(capitalEntry.debit) !== 0 ||
        Number(capitalEntry.credit) !== 10000
    ) {
        throw new Error(
            "Members Capital closing entry is incorrect."
        );
    }

    console.log("Closing Entries: PASS");

    const journals =
        await getAllJournals();

    const closingJournal =
        journals.find(
            journal =>
                journal.reference ===
                "CLOSING-JOURNAL"
        );

    if (!closingJournal) {
        throw new Error(
            "Persisted closing journal was not found."
        );
    }

    if (
        closingJournal.status !== "POSTED"
    ) {
        throw new Error(
            "Persisted closing journal is not POSTED."
        );
    }

    if (
        closingJournal.financialYearId !==
        financialYear.id
    ) {
        throw new Error(
            "Closing journal financial year context is incorrect."
        );
    }

    if (
        closingJournal.accountingPeriodId !==
        period.id
    ) {
        throw new Error(
            "Closing journal accounting period context is incorrect."
        );
    }

    console.log("Journal Persistence: PASS");
    console.log("Financial Year Context: PASS");
    console.log("Accounting Period Context: PASS");

    const ledgerRepository =
        CMPRepositoryManager.get("ledger");

    const ledgerBatches =
        await ledgerRepository.findAll();

    const ledgerBatch =
        ledgerBatches.find(
            batch =>
                batch.journalReference ===
                "CLOSING-JOURNAL"
        );

    if (!ledgerBatch) {
        throw new Error(
            "Closing journal ledger batch was not found."
        );
    }

    if (
        ledgerBatch.status !== "POSTED"
    ) {
        throw new Error(
            "Closing ledger batch is not POSTED."
        );
    }

    if (
        Number(ledgerBatch.totalDebit) !== 10000
    ) {
        throw new Error(
            \`Expected ledger debit of 10000, received \${ledgerBatch.totalDebit}\`
        );
    }

    if (
        Number(ledgerBatch.totalCredit) !== 10000
    ) {
        throw new Error(
            \`Expected ledger credit of 10000, received \${ledgerBatch.totalCredit}\`
        );
    }

    if (
        ledgerBatch.financialYearId !==
        financialYear.id
    ) {
        throw new Error(
            "Ledger financial year context is incorrect."
        );
    }

    if (
        ledgerBatch.accountingPeriodId !==
        period.id
    ) {
        throw new Error(
            "Ledger accounting period context is incorrect."
        );
    }

    console.log("Ledger Batch Persistence: PASS");
    console.log("Ledger Balanced: PASS");
    console.log("Ledger Financial Year Context: PASS");
    console.log("Ledger Accounting Period Context: PASS");

    console.log("");
    console.log("=========================================");
    console.log("RC083 TEST COMPLETE: PASS");
    console.log("=========================================");

}

run().catch(error => {

    console.error("");
    console.error("=========================================");
    console.error("RC083 TEST COMPLETE: FAIL");
    console.error("=========================================");
    console.error(error.message);

    process.exitCode = 1;

});
`
    }

];

async function run() {

    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC083 - CREATE CLOSING JOURNAL POSTING TEST");
    console.log("=========================================");

    const result =
        await transaction(patches);

    console.log(
        "RC083 TRANSACTION RESULT:"
    );

    console.log(
        JSON.stringify(result, null, 2)
    );

    if (!result.success) {

        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC083 PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC083 PATCH COMPLETE");
    console.log("=========================================");

}

run();
