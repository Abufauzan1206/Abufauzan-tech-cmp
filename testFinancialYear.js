import {
    createYear,
    closeYear,
    reopenYear
} from "./js/business/financialYearEngine.js";
import {
    getFinancialYearById
} from "./js/services/financialYearService.js";

console.log("");
console.log("=========================================");
console.log(" ABUFAUZAN TECH CMP");

const financialYear = await createYear({
    name: "FY 2026 Financial Year Test",
    startDate: "2026-01-01",
    endDate: "2026-12-31"
});

const yearId = financialYear.id;

const closeReport = await closeYear(yearId);
console.log(" FINANCIAL YEAR ENGINE");
console.log("=========================================");

const closedYear = await getFinancialYearById(yearId);

console.log("");
console.log("Close Report:");
console.log(closeReport);
console.log("Closed Status:", closedYear.status);

console.log("");
console.log("Is 2026 Closed?");
console.log(closedYear.status === "CLOSED");

const reopenReport = await reopenYear(yearId);

console.log("");
console.log("Reopen Report:");
console.log(reopenReport);

console.log("");
console.log("Is 2026 Closed?");
const reopenedYear = await getFinancialYearById(yearId);
console.log(reopenedYear.status === "CLOSED");

console.log("");
console.log("=========================================");
