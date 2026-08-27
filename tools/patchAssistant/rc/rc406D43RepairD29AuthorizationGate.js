import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "tools/patchAssistant/rc/rc406D29DrawGroupServiceBehaviorGate.js",
        search: '/Only authorized administrators can update draw group status/',
        replace: '/Unauthorized:\\s*only authorized administrators can update draw group status\\.?/i'
    }
];

const result = await transaction(patches);

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D43 — D29 AUTHORIZATION GATE ALIGNMENT");
console.log("===============================================");

console.log(JSON.stringify(result, null, 2));

if (!result.success) {
    process.exitCode = 1;
}

console.log("===============================================");
console.log("RC406-D43 COMPLETE");
console.log("===============================================");
