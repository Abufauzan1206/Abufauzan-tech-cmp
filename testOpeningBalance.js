import { CMPTransactionEngine } from "./js/business/transactionEngine.js";
import { CMPOpeningBalanceEngine } from "./js/business/openingBalanceEngine.js";
import { seedChartOfAccounts } from "./js/seeders/chartOfAccountsSeeder.js";
import { createPeriod } from "./js/business/accountingPeriodEngine.js";
import { createYear } from "./js/business/financialYearEngine.js";

// Create sample transaction
await seedChartOfAccounts();

const financialYear = await createYear({
    name: "FY 2026 Opening Balance Test",
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

// Generate Opening Balances
const report =
    await CMPOpeningBalanceEngine.generate();

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
