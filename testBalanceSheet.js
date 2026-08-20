import { CMPTransactionEngine } from "./js/business/transactionEngine.js";
import { generateBalanceSheet } from "./js/business/balanceSheetEngine.js";
import { seedChartOfAccounts } from "./js/seeders/chartOfAccountsSeeder.js";
import { createPeriod } from "./js/business/accountingPeriodEngine.js";
import { createYear } from "./js/business/financialYearEngine.js";

await seedChartOfAccounts();

const financialYear = await createYear({
    name: "FY 2026 Balance Sheet Test",
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

// Generate Balance Sheet
const report =
    await generateBalanceSheet();

console.log("");

console.log("=========================================");
console.log(" ABUFAUZAN TECH CMP");
console.log(" BALANCE SHEET");
console.log("=========================================");

console.log("");

console.log("ASSETS");
console.table(report.assets);

console.log("");

console.log("LIABILITIES");
console.table(report.liabilities);

console.log("");

console.log("EQUITY");
console.table(report.equity);

console.log("");

console.log("Total Assets      :", report.totalAssets);
console.log("Total Liabilities :", report.totalLiabilities);
console.log("Total Equity      :", report.totalEquity);

console.log("");

console.log(
    report.balanced
        ? "✓ Balance Sheet Balanced"
        : "✗ Balance Sheet NOT Balanced"
);
