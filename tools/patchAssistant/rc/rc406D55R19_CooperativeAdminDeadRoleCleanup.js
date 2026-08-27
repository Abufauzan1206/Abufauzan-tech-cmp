import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "js/cooperative-admin.js",
        search: `const dashboardRole = "cooperative_admin";`,
        replace: ""
    }
];

const result = await transaction(patches);

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D55R19 — COOPERATIVE ADMIN DEAD ROLE CLEANUP");
console.log("===============================================");
console.log(JSON.stringify(result, null, 2));
console.log("===============================================");

if (!result || result.success === false) {
    console.log(
        "RC406-D55R19 CLEANUP FAILED — TRANSACTION ROLLED BACK"
    );
    process.exitCode = 1;
} else {
    console.log(
        "RC406-D55R19 CLEANUP COMPLETE"
    );
}
