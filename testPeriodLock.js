import { CMPPeriodLockEngine } from "./js/business/periodLockEngine.js";

console.log("");
console.log("=========================================");
console.log(" ABUFAUZAN TECH CMP");
console.log(" PERIOD LOCK ENGINE");
console.log("=========================================");

const lockReport = CMPPeriodLockEngine.lock("2026");

console.log("");
console.log("Lock Report:");
console.log(lockReport);

console.log("");
console.log("Is 2026 Locked?");
console.log(CMPPeriodLockEngine.isLocked("2026"));

const unlockReport = CMPPeriodLockEngine.unlock("2026");

console.log("");
console.log("Unlock Report:");
console.log(unlockReport);

console.log("");
console.log("Is 2026 Locked?");
console.log(CMPPeriodLockEngine.isLocked("2026"));

console.log("");
console.log("=========================================");
