import { CMPTransactionEngine } from "./js/business/transactionEngine.js";
import { CMPStatementOfChangesInEquityEngine } from "./js/business/statementOfChangesInEquityEngine.js";

// Sample transaction
CMPTransactionEngine.create({

    type: "CONTRIBUTION",

    amount: 10000,

    description: "Monthly Contribution"

});

// Generate Statement of Changes in Equity
const report = CMPStatementOfChangesInEquityEngine.generate({

    openingEquity: 50000,

    memberCapital: 10000,

    adjustments: 0

});

console.log("");

console.log("=========================================");
console.log(" ABUFAUZAN TECH CMP");
console.log(" STATEMENT OF CHANGES IN EQUITY");
console.log("=========================================");

console.log("");

console.log("Opening Equity   :", report.openingEquity);
console.log("Member Capital   :", report.memberCapital);
console.log("Current Surplus  :", report.currentSurplus);
console.log("Adjustments      :", report.adjustments);

console.log("");

console.log("=========================================");
console.log("Closing Equity   :", report.closingEquity);
console.log("=========================================");
