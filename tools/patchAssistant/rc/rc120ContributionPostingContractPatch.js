import { transaction } from "../patchEngine.js";

const patches = [

    // =====================================================
    // 1. TRANSACTION ENGINE
    // Preserve journal posting result and expose its
    // document references to callers.
    // =====================================================
    {
        path: "js/business/transactionEngine.js",
        mode: "regex",
        search: String.raw`const builtJournal\s*=\s*CMPJournalBuilderEngine\s*\.build\(newTransaction\);\s*await CMPJournalPostingEngine\s*\.post\(builtJournal\);`,
        replace: `const builtJournal =
            CMPJournalBuilderEngine
                .build(newTransaction);

        const postingResult =
            await CMPJournalPostingEngine
                .post(builtJournal);`
    },

    {
        path: "js/business/transactionEngine.js",
        mode: "regex",
        search: String.raw`const transactionRecord\s*=\s*await CMPRepositoryManager\s*\.transaction\s*\.create\(newTransaction\);\s*return transactionRecord;`,
        replace: `const transactionRecord =
            await CMPRepositoryManager
                .transaction
                .create(newTransaction);

        return {
            ...transactionRecord,
            journalDocumentId:
                postingResult.journalDocumentId,
            ledgerDocumentId:
                postingResult.ledgerDocumentId,
            journalNumber:
                postingResult.journalNumber,
            ledgerBatchNumber:
                postingResult.ledgerBatchNumber,
            accountingPeriod:
                postingResult.accountingPeriod,
            financialYearId:
                postingResult.financialYearId,
            accountingPeriodId:
                postingResult.accountingPeriodId
        };`
    },

    // =====================================================
    // 2. CONTRIBUTION POSTING ENGINE
    // Remove the duplicate direct journal posting.
    // Transaction Engine is now the canonical posting path.
    // =====================================================
    {
        path: "js/business/contributionPostingEngine.js",
        mode: "regex",
        search: String.raw`import \{\s*postJournal\s*\} from "\./journalPostingEngine\.js";`,
        replace: ``
    },

    {
        path: "js/business/contributionPostingEngine.js",
        mode: "regex",
        search: String.raw`const journalResult\s*=\s*await postJournal\(\{\s*title:\s*"Contribution Received",\s*debit:\s*data\.amount,\s*credit:\s*data\.amount,\s*debitAccount:\s*"Cash Account",\s*creditAccount:\s*"Contribution Income",\s*createdBy:\s*data\.createdBy \?\? "CMP"\s*\}\);`,
        replace: ``
    },

    {
        path: "js/business/contributionPostingEngine.js",
        mode: "regex",
        search: String.raw`journalNumber:\s*journalResult\.journalNumber,\s*ledgerBatchNumber:\s*journalResult\.ledgerBatchNumber`,
        replace: `journalNumber:
            transactionResult.journalNumber,
        ledgerBatchNumber:
            transactionResult.ledgerBatchNumber,
        journalDocumentId:
            transactionResult.journalDocumentId,
        ledgerDocumentId:
            transactionResult.ledgerDocumentId,
        accountingPeriod:
            transactionResult.accountingPeriod,
        financialYearId:
            transactionResult.financialYearId,
        accountingPeriodId:
            transactionResult.accountingPeriodId`
    },

    // =====================================================
    // 3. CONTRIBUTION MODULE
    // Use the canonical posting engine instead of the
    // nonexistent recordContribution service export.
    // =====================================================
    {
        path: "modules/contributions/script.js",
        mode: "regex",
        search: String.raw`import \{\s*recordContribution\s*\}\s*from "\.\./\.\./js/services/contributionService\.js";`,
        replace: `import {
    postContribution
} from "../../js/business/contributionPostingEngine.js";`
    },

    {
        path: "modules/contributions/script.js",
        mode: "exact",
        search: `await recordContribution({`,
        replace: `await postContribution({`
    }

];

async function run() {

    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC120 - CONTRIBUTION POSTING CONTRACT PATCH");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC120 TRANSACTION RESULT:");
    console.log(
        JSON.stringify(result, null, 2)
    );

    if (!result.success) {
        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC120 PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC120 PATCH COMPLETE");
    console.log("=========================================");
}

run();
