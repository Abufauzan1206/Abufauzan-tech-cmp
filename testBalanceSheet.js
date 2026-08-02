import { CMPTransactionEngine } from "./js/business/transactionEngine.js";
import { CMPBalanceSheetEngine } from "./js/business/balanceSheetEngine.js";

// Sample transaction
CMPTransactionEngine.create({

    type: "CONTRIBUTION",

    amount: 10000,

    description: "Monthly Contribution"

});

// Generate Balance Sheet
const report = CMPBalanceSheetEngine.generate();

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
