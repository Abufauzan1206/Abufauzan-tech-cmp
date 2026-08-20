import { transaction } from "../patchEngine.js";

const target = "testOpeningBalance.js";

async function run() {

    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC064D - ALIGN OPENING BALANCE TEST");
    console.log("=========================================");

    const result = await transaction([
        {
            path: target,
            mode: "exact",
            search:
`import { CMPTransactionEngine } from "./js/business/transactionEngine.js";
import { CMPOpeningBalanceEngine } from "./js/business/openingBalanceEngine.js";`,
            replace:
`import { CMPTransactionEngine } from "./js/business/transactionEngine.js";
import { CMPOpeningBalanceEngine } from "./js/business/openingBalanceEngine.js";
import { seedChartOfAccounts } from "./js/seeders/chartOfAccountsSeeder.js";
import { createPeriod } from "./js/business/accountingPeriodEngine.js";
import { createYear } from "./js/business/financialYearEngine.js";`
        },

        {
            path: target,
            mode: "exact",
            search:
`// Create sample transaction
CMPTransactionEngine.create({
    type: "CONTRIBUTION",
    amount: 10000,
    description: "Monthly Contribution"
});`,
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

await CMPTransactionEngine.create({
    type: "CONTRIBUTION",
    amount: 10000,
    description: "Monthly Contribution"
});`
        },

        {
            path: target,
            mode: "exact",
            search:
`// Generate Opening Balances
const report =
    CMPOpeningBalanceEngine.generate();`,
            replace:
`// Generate Opening Balances
const report =
    await CMPOpeningBalanceEngine.generate();

if (!report.openingBalances) {
    throw new Error(
        "Opening Balance report was not generated."
    );
}`
        }
    ]);

    console.log("RC064D TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;
        console.log("=========================================");
        console.log("RC064D PATCH FAIL");
        console.log("=========================================");
        return;
    }

    console.log("=========================================");
    console.log("RC064D PATCH COMPLETE");
    console.log("=========================================");
}

run();
