import { CMPTransactionEngine } from "./js/business/transactionEngine.js";
import { CMPCashFlowEngine } from "./js/business/cashFlowEngine.js";
import { seedChartOfAccounts } from "./js/seeders/chartOfAccountsSeeder.js";
import { createPeriod } from "./js/business/accountingPeriodEngine.js";
import { createYear } from "./js/business/financialYearEngine.js";

await seedChartOfAccounts();

const financialYear = await createYear({
    name: "FY 2026 Cash Flow Test",
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

// Generate Cash Flow Statement
const report =
    await CMPCashFlowEngine.generate();

if (report.netCashFlow !== 10000) {

    throw new Error(
        "Unexpected net cash flow: " +
        report.netCashFlow
    );

}

console.log("");

console.log("=========================================");
console.log(" ABUFAUZAN TECH CMP");
console.log(" CASH FLOW STATEMENT");
console.log("=========================================");

console.log("");

console.log("OPERATING ACTIVITIES");
console.table(report.operating);

console.log("");

console.log("INVESTING ACTIVITIES");
console.table(report.investing);

console.log("");

console.log("FINANCING ACTIVITIES");
console.table(report.financing);

console.log("");

console.log("Net Operating Cash :", report.operatingCash);
console.log("Net Investing Cash :", report.investingCash);
console.log("Net Financing Cash :", report.financingCash);

console.log("");

console.log("=========================================");
console.log("NET CASH FLOW :", report.netCashFlow);
console.log("=========================================");
