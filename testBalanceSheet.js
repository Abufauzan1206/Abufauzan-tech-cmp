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

const cash = report.assets.find(
    account => account.account === "Cash Account"
);

if (!cash) {
    throw new Error(
        "Cash Account missing from Balance Sheet assets."
    );
}

if (cash.balance !== 10000) {
    throw new Error(
        "Cash Account balance is incorrect."
    );
}

if (report.totalAssets !== 10000) {
    throw new Error(
        "Total assets verification failed."
    );
}

if (report.totalLiabilities !== 0) {
    throw new Error(
        "Total liabilities verification failed."
    );
}

if (report.totalEquity !== 10000) {
    throw new Error(
        "Total equity verification failed."
    );
}

const expectedEquity =
    report.totalAssets -
    report.totalLiabilities;

if (report.totalEquity !== expectedEquity) {
    throw new Error(
        "Balance Sheet accounting equation verification failed."
    );
}

if (report.balanced !== true) {
    throw new Error(
        "Balance Sheet should be balanced."
    );
}

console.log("");
console.log("Cash Account Classification Verification: PASS");
console.log("Cash Account Balance Verification: PASS");
console.log("Total Assets Verification: PASS");
console.log("Total Liabilities Verification: PASS");
console.log("Total Equity Verification: PASS");
console.log("Accounting Equation Verification: PASS");
console.log("Balance Sheet Balanced Verification: PASS");
console.log("Balance Sheet Verification: PASS");

console.log("");
console.log(
    report.balanced
        ? "✓ Balance Sheet Balanced"
        : "✗ Balance Sheet NOT Balanced"
);
