import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "tools/patchAssistant/rc/rc211MemberRegistrationRuntimeContractGate.js",
        mode: "text",
        search: `        email: "rc211@test.local"
    });`,
        replace: `        email: "rc211@test.local",
        cooperativeId: "RC211-TEST-COOPERATIVE"
    });`
    },
    {
        path: "tools/patchAssistant/rc/rc211MemberRegistrationRuntimeContractGate.js",
        mode: "text",
        search: `        email: "rc211@test.local",
        status: "active"
    };`,
        replace: `        email: "rc211@test.local",
        cooperativeId: "RC211-TEST-COOPERATIVE",
        status: "active"
    };`
    }
];

console.log("==================================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC213 — ALIGN RC211 COOPERATIVE OWNERSHIP CONTRACT");
console.log("==================================================");
console.log("PATCH COUNT:", patches.length);
console.log("");

const result = await transaction(patches);

console.log("TRANSACTION RESULT:");
console.log(JSON.stringify(result, null, 2));
console.log("");

if (!result.success) {
    console.log("RC213 ALIGN RC211 OWNERSHIP CONTRACT: FAIL");
    process.exitCode = 1;
} else {
    console.log("RC213 ALIGN RC211 OWNERSHIP CONTRACT: PASS");
}

console.log("==================================================");


