import { patch, transaction } from "../patchEngine.js";

const patches = [
    {
        path: "js/services/drawGroupService.js",
        search:
            '"Only authorized administrators can update draw group status."',
        replace:
            '"Unauthorized: only authorized administrators can update draw group status."'
    },
    {
        path: "tools/patchAssistant/rc/rc406D36DrawGroupStatusTransitionContractGate.js",
        search:
            '/status\\s*:/.test(statusSource)',
        replace:
            '/(?:status\\s*:|\\bstatus\\b\\s*\\n?\\s*})/.test(statusSource)'
    }
];

const result = await transaction(patches);

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D36 — STATUS TRANSITION GATE COMPATIBILITY PATCH");
console.log("===============================================");
console.log(JSON.stringify(result, null, 2));
console.log("===============================================");
console.log("RC406-D36 PATCH COMPLETE");
console.log("===============================================");

if (!result || result.success === false) {
    process.exitCode = 1;
}
