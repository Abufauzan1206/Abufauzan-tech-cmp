import { transaction } from "../patchEngine.js";

const path = "tools/patchAssistant/rc/rc406D28FullDrawGroupServiceGate.js";

const oldAssertion = `        name: "status update authorization",
        pass: /Only authorized administrators can update draw group status/.test(source)
    },`;

const newAssertion = `        name: "status update authorization",
        pass: /(?:Only authorized administrators can update draw group status|Unauthorized: only authorized administrators can update draw group status)/.test(source)
    },`;

const patches = [
    {
        path,
        search: oldAssertion,
        replace: newAssertion
    }
];

const result = await transaction(patches);

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D28 — STATUS AUTHORIZATION GATE COMPATIBILITY PATCH");
console.log("===============================================");
console.log(JSON.stringify(result, null, 2));
console.log("===============================================");

if (!result || result.success === false) {
    console.log(
        "RC406-D28 PATCH FAILED — TRANSACTION ROLLED BACK"
    );
    process.exitCode = 1;
} else {
    console.log(
        "RC406-D28 PATCH COMPLETE"
    );
}
