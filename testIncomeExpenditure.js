import { CMPTransactionEngine } from "./js/business/transactionEngine.js";
import { seedChartOfAccounts } from "./js/seeders/chartOfAccountsSeeder.js";
import { createPeriod } from "./js/business/accountingPeriodEngine.js";
import { createYear } from "./js/business/financialYearEngine.js";
import {
    generateIncomeExpenditure
} from "./js/business/incomeExpenditureEngine.js";

await seedChartOfAccounts();

const financialYear = await createYear({
    name: "FY 2026 Income Expenditure Test",
    startDate: "2026-01-01T00:00:00.000Z",
    endDate: "2026-12-31T23:59:59.999Z"
});

const accountingPeriod = await createPeriod({
    name: "2026",
    financialYearId: financialYear.id,
    startDate: "2026-01-01T00:00:00.000Z",
    endDate: "2026-12-31T23:59:59.999Z"
});

// Sample transactions
await CMPTransactionEngine.create({

    type: "CONTRIBUTION",
    amount: 10000,
    description: "Monthly Contribution"

});

// Generate report
const report =
    await generateIncomeExpenditure();

console.log("");

console.log("=========================================");
console.log(" ABUFAUZAN TECH CMP");
console.log(" INCOME & EXPENDITURE STATEMENT");
console.log("=========================================");

console.log("");

console.log("INCOME");
console.log("-----------------------------------------");

report.incomeAccounts.forEach(item => {

    console.log(
        `${item.account} : NGN ${item.credit}`
    );

});

console.log("-----------------------------------------");
console.log(`TOTAL INCOME : NGN ${report.totalIncome}`);

console.log("");

console.log("EXPENDITURE");
console.log("-----------------------------------------");

report.expenseAccounts.forEach(item => {

    console.log(
        `${item.account} : NGN ${item.debit}`
    );

});

console.log("-----------------------------------------");
console.log(`TOTAL EXPENDITURE : NGN ${report.totalExpenses}`);

console.log("");

console.log("=========================================");
console.log(
    `NET SURPLUS : NGN ${report.netSurplus}`
);

if (
    report.netSurplus !==
    report.totalIncome -
    report.totalExpenses
) {

    throw new Error(
        "Net surplus calculation is incorrect."
    );
}

console.log("");
console.log("INCOME & EXPENDITURE TEST: PASS");
console.log("=========================================");
