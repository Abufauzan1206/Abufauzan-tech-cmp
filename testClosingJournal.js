import { CMPTransactionEngine } from "./js/business/transactionEngine.js";
import { CMPClosingJournalEngine } from "./js/business/closingJournalEngine.js";

// Create a sample transaction
CMPTransactionEngine.create({

    type: "CONTRIBUTION",

    amount: 10000,

    description: "Monthly Contribution"

});

// Generate Closing Journal
const report = CMPClosingJournalEngine.generate();

console.log("");

console.log("=========================================");
console.log(" ABUFAUZAN TECH CMP");
console.log(" CLOSING JOURNAL");
console.log("=========================================");

console.log("");

console.log("Current Surplus:", report.surplus);

console.log("");

console.table(report.entries);

console.log("");

console.log("Generated At:", report.generatedAt);

console.log("=========================================");
