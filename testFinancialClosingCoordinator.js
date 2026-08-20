import { CMPTransactionEngine } from "./js/business/transactionEngine.js";
import { createPeriod } from "./js/business/accountingPeriodEngine.js";
import { seedChartOfAccounts } from "./js/seeders/chartOfAccountsSeeder.js";
import { createYear } from "./js/business/financialYearEngine.js";
import { CMPFinancialClosingCoordinator } from "./js/business/financialClosingCoordinator.js";

await seedChartOfAccounts();

const financialYear =
    await createYear({
        name: "FY 2026 RC",
        startDate: "2026-01-01",
        endDate: "2026-12-31"
});

const accountingPeriod = await createPeriod({
    name: "August 2026",
    financialYearId: financialYear.id,
    startDate: "2026-01-01",
    endDate: "2026-12-31"
});

await CMPTransactionEngine.create({
    type: "CONTRIBUTION",
    amount: 10000,
    description: "Monthly Contribution"
});

const report =
    await CMPFinancialClosingCoordinator.close(
        financialYear.id,
        2026
    );


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

