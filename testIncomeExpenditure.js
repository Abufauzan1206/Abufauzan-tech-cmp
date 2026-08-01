import { CMPTransactionEngine } from "./js/business/transactionEngine.js";
import { CMPIncomeExpenditureEngine } from "./js/business/incomeExpenditureEngine.js";

// Sample transactions
CMPTransactionEngine.create({

    type: "CONTRIBUTION",
    amount: 10000,
    description: "Monthly Contribution"

});

// Generate report
const report = CMPIncomeExpenditureEngine.generate();

console.log("");

console.log("=========================================");
console.log(" ABUFAUZAN TECH CMP");
console.log(" INCOME & EXPENDITURE STATEMENT");
console.log("=========================================");

console.log("");

console.log("INCOME");
console.log("-----------------------------------------");

report.income.forEach(item => {

    console.log(
        `${item.account} : NGN ${item.credit}`
    );

});

console.log("-----------------------------------------");
console.log(`TOTAL INCOME : NGN ${report.totalIncome}`);

console.log("");

console.log("EXPENDITURE");
console.log("-----------------------------------------");

report.expenses.forEach(item => {

    console.log(
        `${item.account} : NGN ${item.debit}`
    );

});

console.log("-----------------------------------------");
console.log(`TOTAL EXPENDITURE : NGN ${report.totalExpenses}`);

console.log("");

console.log("=========================================");
console.log(`NET SURPLUS : NGN ${report.surplus}`);
console.log("=========================================");
