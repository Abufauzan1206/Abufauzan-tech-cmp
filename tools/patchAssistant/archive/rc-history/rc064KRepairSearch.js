import { transaction } from "../patchEngine.js";

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC064K - REPAIR SEARCH TARGETS");
    console.log("=========================================");

    const result = await transaction([
        {
            path: "js/business/ledgerBatchPostingEngine.js",
            mode: "exact",
            search: `        ...(options.sandboxId
            ? {
                sandboxId:
                    options.sandboxId
            }
            : {}),`,
            replace: `        ...(options.sandboxId
            ? {
                sandboxId:
                    options.sandboxId
            }
            : {}),

        ...(options.financialYearId
            ? {
                financialYearId:
                    options.financialYearId
            }
            : {}),

        ...(options.accountingPeriodId
            ? {
                accountingPeriodId:
                    options.accountingPeriodId
            }
            : {}),

        ...(options.accountingPeriod
            ? {
                accountingPeriod:
                    options.accountingPeriod
            }
            : {}),`
        },
        {
            path: "js/business/journalPostingEngine.js",
            mode: "exact",
            search: `            {
                sandboxId:
                    sandbox?.sandboxId,

                journalReference:
                    data.reference,

                journalNumber

            }`,
            replace: `            {
                sandboxId:
                    sandbox?.sandboxId,

                journalReference:
                    data.reference,

                journalNumber,
                financialYearId:
                    period.financialYearId,
                accountingPeriodId:
                    period.id,
                accountingPeriod:
                    period.name

            }`
        }
    ]);

    console.log("RC064K TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;
        console.log("=========================================");
        console.log("RC064K PATCH FAIL");
        console.log("=========================================");
        return;
    }

    console.log("=========================================");
    console.log("RC064K PATCH COMPLETE");
    console.log("=========================================");
}

run();
