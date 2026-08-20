import { CMPTransactionEngine } from "./js/business/transactionEngine.js";
import { CMPStatementOfChangesInEquityEngine } from "./js/business/statementOfChangesInEquityEngine.js";
import {
    seedChartOfAccounts
} from "./js/seeders/chartOfAccountsSeeder.js";

import {
    createPeriod
} from "./js/business/accountingPeriodEngine.js";

import {
    createYear
} from "./js/business/financialYearEngine.js";

await seedChartOfAccounts();

const financialYear = await createYear({
    name:
        "FY 2026 Statement of Changes in Equity Test",
    startDate:
        "2026-01-01T00:00:00.000Z",
    endDate:
        "2026-12-31T23:59:59.999Z"
});

await createPeriod({
    name:
        "2026 Statement of Changes in Equity Test",
    financialYearId:
        financialYear.id,
    startDate:
        "2026-01-01T00:00:00.000Z",
    endDate:
        "2026-12-31T23:59:59.999Z"
});

// Sample transaction
await CMPTransactionEngine.create({

    type: "CONTRIBUTION",

    amount: 10000,

    description: "Monthly Contribution"

});

// Generate Statement of Changes in Equity
const report =
    await CMPStatementOfChangesInEquityEngine.generate({

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

if (report.openingEquity !== 50000) {
    throw new Error(
        "Opening equity verification failed."
    );
}

if (report.memberCapital !== 10000) {
    throw new Error(
        "Member capital verification failed."
    );
}

if (report.currentSurplus !== 10000) {
    throw new Error(
        "Current surplus verification failed."
    );
}

if (report.adjustments !== 0) {
    throw new Error(
        "Adjustments verification failed."
    );
}

if (report.closingEquity !== 70000) {
    throw new Error(
        "Closing equity verification failed."
    );
}

const expectedClosingEquity =
    report.openingEquity +
    report.memberCapital +
    report.currentSurplus +
    report.adjustments;

if (report.closingEquity !== expectedClosingEquity) {
    throw new Error(
        "Closing equity calculation is incorrect."
    );
}

console.log("");
console.log("Opening Equity Verification: PASS");
console.log("Member Capital Verification: PASS");
console.log("Current Surplus Verification: PASS");
console.log("Adjustments Verification: PASS");
console.log("Closing Equity Verification: PASS");
console.log("Closing Equity Calculation Verification: PASS");
console.log("Statement of Changes in Equity Verification: PASS");

console.log("=========================================");
