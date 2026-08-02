import { CMPTransactionEngine } from "./js/business/transactionEngine.js";
import { CMPOpeningBalanceEngine } from "./js/business/openingBalanceEngine.js";

// Create sample transaction
CMPTransactionEngine.create({

    type: "CONTRIBUTION",

    amount: 10000,

    description: "Monthly Contribution"

});

// Generate Opening Balances
const report =
    CMPOpeningBalanceEngine.generate();

console.log("");

console.log("=========================================");
console.log(" ABUFAUZAN TECH CMP");
console.log(" OPENING BALANCE GENERATOR");
console.log("=========================================");

console.log("");

console.log("Financial Year :", report.financialYear);

console.log("");

console.table(report.openingBalances);

console.log("");

console.log("Generated At :", report.generatedAt);

console.log("=========================================");
