import { CMPTransactionEngine } from "./js/business/transactionEngine.js";
import { CMPFinancialClosingCoordinator } from "./js/business/financialClosingCoordinator.js";

CMPTransactionEngine.create({

    type: "CONTRIBUTION",

    amount: 10000,

    description: "Monthly Contribution"

});


const report =
    CMPFinancialClosingCoordinator.close(2026);


console.log("");

console.log("=========================================");
console.log(" ABUFAUZAN TECH CMP");
console.log(" FINANCIAL CLOSING COORDINATOR");
console.log("=========================================");

console.log("");

console.log("Year:", report.year);

console.log("Status:", report.status);

console.log("");

console.log(
    "Trial Balance Balanced:",
    report.trialBalance.balanced
);

console.log("");

console.log(
    "Period Lock:",
    report.periodLock.status
);

console.log("");

console.log(
    "Financial Year:",
    report.financialYear.status
);

console.log("");

console.log(
    "Audit Action:",
    report.audit.action
);

console.log("");

console.log("=========================================");

