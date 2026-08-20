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

const contributionIncome = report.incomeAccounts.find(
    account => account.account === "Contribution Income"
);

if (!contributionIncome) {
    throw new Error(
        "Contribution Income missing from Income & Expenditure Statement."
    );
}

if (
    contributionIncome.credit !== 10000 ||
    contributionIncome.debit !== 0
) {
    throw new Error(
        "Contribution Income values are incorrect."
    );
}

if (report.totalIncome !== 10000) {
    throw new Error(
        "Total income is incorrect."
    );
}

if (report.totalExpenses !== 0) {
    throw new Error(
        "Total expenditure is incorrect."
    );
}

if (report.netSurplus !== 10000) {
    throw new Error(
        "Net surplus is incorrect."
    );
}

if (report.netDeficit !== 0) {
    throw new Error(
        "Net deficit is incorrect."
    );
}

console.log("");
console.log("Income Classification Verification: PASS");
console.log("Contribution Income Verification: PASS");
console.log("Total Income Verification: PASS");
console.log("Total Expenditure Verification: PASS");
console.log("Net Surplus Verification: PASS");
console.log("Net Deficit Verification: PASS");
console.log("Income & Expenditure Verification: PASS");
console.log("=========================================");