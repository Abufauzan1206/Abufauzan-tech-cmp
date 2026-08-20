import { CMPTransactionEngine } from "./js/business/transactionEngine.js";
import { generateTrialBalance } from "./js/business/trialBalanceEngine.js";
import { seedChartOfAccounts } from "./js/seeders/chartOfAccountsSeeder.js";
import { createPeriod } from "./js/business/accountingPeriodEngine.js";
import { createYear } from "./js/business/financialYearEngine.js";

await seedChartOfAccounts();

const financialYear = await createYear({
    name: "FY 2026 Trial Balance Test",
    startDate: "2026-01-01T00:00:00.000Z",
    endDate: "2026-12-31T23:59:59.999Z"
});

await createPeriod({
    name: "2026",
    financialYearId: financialYear.id,
    startDate: "2026-01-01T00:00:00.000Z",
    endDate: "2026-12-31T23:59:59.999Z"
});

await CMPTransactionEngine.create({
    type: "CONTRIBUTION",
    amount: 10000,
    description: "Monthly Contribution"
});

const report = await generateTrialBalance();

if (!report.success) {
    throw new Error("Trial Balance generation failed.");
}

if (!report.balanced) {
    throw new Error("Trial Balance is not balanced.");
}

if (report.totalDebit !== 10000) {
    throw new Error(
        `Expected total debit of 10000, got ${report.totalDebit}.`
    );
}

if (report.totalCredit !== 10000) {
    throw new Error(
        `Expected total credit of 10000, got ${report.totalCredit}.`
    );
}

if (!Array.isArray(report.accounts)) {
    throw new Error("Trial Balance accounts must be an array.");
}

const cash = report.accounts.find(
    account => account.account === "Cash Account"
);

const contributionIncome = report.accounts.find(
    account => account.account === "Contribution Income"
);

if (!cash) {
    throw new Error("Cash Account missing from Trial Balance.");
}

if (!contributionIncome) {
    throw new Error(
        "Contribution Income missing from Trial Balance."
    );
}

if (
    cash.debit !== 10000 ||
    cash.credit !== 0 ||
    cash.balance !== 10000
) {
    throw new Error("Cash Account Trial Balance values are incorrect.");
}

if (
    contributionIncome.debit !== 0 ||
    contributionIncome.credit !== 10000 ||
    contributionIncome.balance !== -10000
) {
    throw new Error(
        "Contribution Income Trial Balance values are incorrect."
    );
}

console.log("=========================================");
console.log("ABUFAUZAN TECH CMP");
console.log("TRIAL BALANCE VERIFICATION");
console.log("=========================================");

console.log("");
console.log("Accounts:");
console.table(report.accounts);

console.log("");
console.log("Total Debit :", report.totalDebit);
console.log("Total Credit:", report.totalCredit);

console.log("");
console.log("Balanced Verification: PASS");
console.log("Cash Account Verification: PASS");
console.log("Contribution Income Verification: PASS");
console.log("Trial Balance Verification: PASS");

console.log("=========================================");