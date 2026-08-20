import { transaction } from "../patchEngine.js";

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC064L - REPAIR JOURNAL CONTEXT SEARCH");
    console.log("=========================================");

    const result = await transaction([
        {
            path: "js/business/journalPostingEngine.js",
            mode: "exact",
            search: `        journalNumber,
        status:                                                   "POSTED",`,
            replace: `        financialYearId:
            period.financialYearId,

        accountingPeriodId:
            period.id,

        accountingPeriod:
            period.name,

        journalNumber,
        status:                                                   "POSTED",`
        }
    ]);

    console.log("RC064L TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;
        console.log("=========================================");
        console.log("RC064L PATCH FAIL");
        console.log("=========================================");
        return;
    }

    console.log("=========================================");
    console.log("RC064L PATCH COMPLETE");
    console.log("=========================================");
}

run();
