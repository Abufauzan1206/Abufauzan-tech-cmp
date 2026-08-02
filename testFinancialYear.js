import { CMPFinancialYearEngine } from "./js/business/financialYearEngine.js";

console.log("");
console.log("=========================================");
console.log(" ABUFAUZAN TECH CMP");
console.log(" FINANCIAL YEAR ENGINE");
console.log("=========================================");

const closeReport = CMPFinancialYearEngine.close(2026);

console.log("");
console.log("Close Report:");
console.log(closeReport);

console.log("");
console.log("Is 2026 Closed?");
console.log(CMPFinancialYearEngine.isClosed(2026));

const reopenReport = CMPFinancialYearEngine.reopen(2026);

console.log("");
console.log("Reopen Report:");
console.log(reopenReport);

console.log("");
console.log("Is 2026 Closed?");
console.log(CMPFinancialYearEngine.isClosed(2026));

console.log("");
console.log("=========================================");
