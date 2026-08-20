import { CMPReportExportEngine } from "./js/business/reportExportEngine.js";

const report = CMPReportExportEngine.build({

    title: "Trial Balance",

    period: "Financial Year 2026",

    generatedBy: "ADMIN",

    data: [

        {
            account: "Cash Account",
            debit: 10000,
            credit: 0
        },

        {
            account: "Member Contributions",
            debit: 0,
            credit: 10000
        }

    ]

});

console.log("");

console.log("=========================================");
console.log(" ABUFAUZAN TECH CMP");
console.log(" REPORT EXPORT FRAMEWORK");
console.log("=========================================");

console.log(report);

console.log("");

console.log("=========================================");
