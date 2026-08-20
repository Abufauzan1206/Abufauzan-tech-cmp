import { transaction } from "../patchEngine.js";

const file = "js/services/trialBalanceService.js";

async function run() {

    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC043 - TRIAL BALANCE LEDGER SOURCE");
    console.log("=========================================");

    const result = await transaction([
        {
            path: file,
            mode: "regex",
            search: 'const trialBalanceRepository\\s*=\\s*CMPRepositoryManager\\.get\\("trialBalance"\\);',
            replace: 'const trialBalanceRepository =\n    CMPRepositoryManager.get("ledgerBatch");'
        }
    ]);

    console.log("RC043 TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;
        return;
    }

    console.log("=========================================");
    console.log("RC043 PATCH COMPLETE");
    console.log("=========================================");
}

run();
