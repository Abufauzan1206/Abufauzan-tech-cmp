import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "tools/patchAssistant/rc/rc406D32DrawGroupRuntimeContractGate.js",
        search: 'pass: /Only authorized administrators can update draw group status/.test(source)',
        replace: 'pass: /Unauthorized:\\s*only authorized administrators can update draw group status\\.?/i.test(source)'
    }
];

const result = await transaction(patches);

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D40 — D32 FALSE-NEGATIVE GATE REPAIR");
console.log("===============================================");

console.log(JSON.stringify(result, null, 2));

if (!result.success) {
    process.exitCode = 1;
}

console.log("===============================================");
console.log("RC406-D40 COMPLETE");
console.log("===============================================");
