import { CMPTransactionEngine } from "./js/business/transactionEngine.js";
import { CMPCashFlowEngine } from "./js/business/cashFlowEngine.js";

// Sample transaction
CMPTransactionEngine.create({

    type: "CONTRIBUTION",

    amount: 10000,

    description: "Monthly Contribution"

});

// Generate Cash Flow Statement
const report = CMPCashFlowEngine.generate();

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
