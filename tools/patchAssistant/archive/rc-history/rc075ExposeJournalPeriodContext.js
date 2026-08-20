import { patch } from "../patchEngine.js";

const file = "js/business/journalPostingEngine.js";

async function run() {
    try {
        await patch({
            path: file,
            mode: "regex",
            search: 'accountingPeriod:\\s*period\\.name,\\s*message:\\s*"Journal posted successfully\\."',
            replace: `accountingPeriod:
            period.name,

        financialYearId:
            period.financialYearId,

        accountingPeriodId:
            period.id,

        message:
            "Journal posted successfully."`
        });

        console.log("=========================================");
        console.log("ABUFAUZAN TECH CMP");
        console.log("RC075 - EXPOSE JOURNAL PERIOD CONTEXT");
        console.log("=========================================");
        console.log("PATCH: PASS");
    }
    catch (error) {
        console.error("RC075 PATCH: FAIL");
        console.error(error.message);
        process.exitCode = 1;
    }
}

run();
