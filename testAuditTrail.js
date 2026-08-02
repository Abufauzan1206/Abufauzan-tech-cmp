import { CMPAuditTrailEngine } from "./js/business/auditTrailEngine.js";

CMPAuditTrailEngine.record({

    user: "SYSTEM",

    action: "CREATE",

    module: "Contribution",

    reference: "TRX-001",

    description: "Monthly contribution recorded"

});

CMPAuditTrailEngine.record({

    user: "ADMIN",

    action: "LOCK",

    module: "Financial Year",

    reference: "2026",

    description: "Financial year closed"

});

CMPAuditTrailEngine.record({

    user: "AUDITOR",

    action: "VIEW",

    module: "Trial Balance",

    reference: "TB-2026",

    description: "Viewed Trial Balance report"

});

console.log("");

console.log("=========================================");
console.log(" ABUFAUZAN TECH CMP");
console.log(" AUDIT TRAIL");
console.log("=========================================");

console.log("");

console.table(CMPAuditTrailEngine.getAll());

console.log("");

console.log("Total Logs:", CMPAuditTrailEngine.getAll().length);

console.log("");

console.log("=========================================");
