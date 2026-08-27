import { transaction } from "../patchEngine.js";

const target =
    "tools/patchAssistant/rc/rc212MemberRegistrationRuntimeRegressionGate.js";

const patches = [
    {
        path: target,
        mode: "text",
        search: `            email: "rc212c@test.local"
        }`,
        replace: `            email: "rc212c@test.local",
            cooperativeId: "RC212-TEST-COOPERATIVE"
        }`
    }
];

console.log("==================================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC215 — REPAIR RC212-C COOPERATIVE OWNERSHIP");
console.log("==================================================");
console.log("PATCH COUNT:", patches.length);
console.log("");

const result = await transaction(patches);

console.log("TRANSACTION RESULT:");
console.log(JSON.stringify(result, null, 2));
console.log("");

if (!result.success) {
    console.log(
        "RC215 REPAIR RC212-C COOPERATIVE OWNERSHIP: FAIL"
    );
    process.exitCode = 1;
} else {
    console.log(
        "RC215 REPAIR RC212-C COOPERATIVE OWNERSHIP: PASS"
    );
}

console.log("==================================================");
