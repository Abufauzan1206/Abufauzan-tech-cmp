import { transaction } from "../patchEngine.js";

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC064L - REMOVE DUPLICATE ACCOUNTING PERIOD");
    console.log("=========================================");

    const result = await transaction([
        {
            path: "js/business/journalPostingEngine.js",
            mode: "exact",
            search: `        accountingPeriod:
            period.name,

        financialYearId:`,
            replace: `        financialYearId:`
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
