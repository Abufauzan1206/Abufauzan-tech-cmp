import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "testGeneralLedgerTransactionIntegration.js",
        mode: "regex",
        search: String.raw`journal\.accountingPeriod !== period\.name`,
        replace: `journal.accountingPeriod !== period.period.name`
    },
    {
        path: "testGeneralLedgerTransactionIntegration.js",
        mode: "regex",
        search: String.raw`ledgerBatch\.accountingPeriod !== period\.name`,
        replace: `ledgerBatch.accountingPeriod !== period.period.name`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC123M - ACCOUNTING PERIOD ASSERTION FIX");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC123M TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;
        console.log("=========================================");
        console.log("RC123M PATCH FAIL");
        console.log("=========================================");
        return;
    }

    console.log("=========================================");
    console.log("RC123M PATCH COMPLETE");
    console.log("=========================================");
}

run();
