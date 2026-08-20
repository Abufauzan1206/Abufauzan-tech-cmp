import { transaction } from "../patchEngine.js";

const target = "testOpeningBalance.js";

async function run() {

    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC064F - ALIGN OPENING BALANCE TRANSACTION");
    console.log("=========================================");

    const result = await transaction([
        {
            path: target,
            mode: "exact",
            search: "CMPTransactionEngine.create({",
            replace:
`await seedChartOfAccounts();

const financialYear = await createYear({
    name: "FY 2026 Opening Balance Test",
    startDate: "2026-01-01T00:00:00.000Z",
    endDate: "2026-12-31T23:59:59.999Z"
});

await createPeriod({
    name: "2026",
    financialYearId: financialYear.id,
    startDate: "2026-01-01T00:00:00.000Z",
    endDate: "2026-12-31T23:59:59.999Z"
});

await CMPTransactionEngine.create({`
        }
    ]);

    console.log("RC064F TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;
        console.log("=========================================");
        console.log("RC064F PATCH FAIL");
        console.log("=========================================");
        return;
    }

    console.log("=========================================");
    console.log("RC064F PATCH COMPLETE");
    console.log("=========================================");
}

run();
