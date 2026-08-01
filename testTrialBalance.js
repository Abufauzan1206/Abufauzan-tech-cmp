import { CMPTransactionEngine } from "./js/business/transactionEngine.js";
import { CMPTrialBalanceEngine } from "./js/business/trialBalanceEngine.js";

// Create a sample transaction
CMPTransactionEngine.create({

    type: "CONTRIBUTION",

    amount: 10000,

    description: "Monthly Contribution"

});

// Generate Trial Balance
const report = CMPTrialBalanceEngine.generate();

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
