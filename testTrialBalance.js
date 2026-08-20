import { CMPTransactionEngine } from "./js/business/transactionEngine.js";
import { generateTrialBalance } from "./js/business/trialBalanceEngine.js";
import { seedChartOfAccounts } from "./js/seeders/chartOfAccountsSeeder.js";
import { createPeriod } from "./js/business/accountingPeriodEngine.js";
import { createYear } from "./js/business/financialYearEngine.js";

await seedChartOfAccounts();

const financialYear = await createYear({
    name: "FY 2026 Trial Balance Test",
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
});

// Generate Trial Balance
const report =
    await generateTrialBalance();

if (!report.balanced) {
    throw new Error(
        "Trial Balance is not balanced."
    );
}

console.log("========== TRIAL BALANCE ==========");

console.log(report.accounts);

console.log("");

console.log("Total Debit :", report.totalDebit);

console.log("Total Credit:", report.totalCredit);

console.log("");

console.log(
    report.balanced
        ? "✓ Trial Balance Balanced"
        : "✗ Trial Balance NOT Balanced"
);
