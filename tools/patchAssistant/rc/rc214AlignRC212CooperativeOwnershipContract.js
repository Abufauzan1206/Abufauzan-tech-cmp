import { transaction } from "../patchEngine.js";

const path =
    "tools/patchAssistant/rc/rc212MemberRegistrationRuntimeRegressionGate.js";

const patches = [
    {
        path,
        mode: "text",
        search: `phone: "08000000212",
            email: "rc212a@test.local"
        },`,
        replace: `phone: "08000000212",
            email: "rc212a@test.local",
            cooperativeId: "RC212-TEST-COOPERATIVE"
        },`
    },
    {
        path,
        mode: "text",
        search: `phone: "08000000213",
            email: "rc212b@test.local"
        },`,
        replace: `phone: "08000000213",
            email: "rc212b@test.local",
            cooperativeId: "RC212-TEST-COOPERATIVE"
        },`
    },
    {
        path,
        mode: "text",
        search: `phone: "08000000214",
            email: "rc212c@test.local"
        }`,
        replace: `phone: "08000000214",
            email: "rc212c@test.local",
            cooperativeId: "RC212-TEST-COOPERATIVE"
        }`
    },
    {
        path,
        mode: "text",
        search: `if (persistedMember.status !== "active") {
            throw new Error(
                \`status mismatch for \${member.memberId}.\`
            );
        }
        console.log(`,
        replace: `if (persistedMember.status !== "active") {
            throw new Error(
                \`status mismatch for \${member.memberId}.\`
            );
        }

        if (
            persistedMember.cooperativeId !==
            member.cooperativeId
        ) {
            throw new Error(
                \`cooperativeId mismatch for \${member.memberId}.\`
            );
        }

        console.log(`
    }
];

console.log("==================================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC214 — ALIGN RC212 COOPERATIVE OWNERSHIP CONTRACT");
console.log("==================================================");
console.log("PATCH COUNT:", patches.length);
console.log("");

const result = await transaction(patches);

console.log("TRANSACTION RESULT:");
console.log(JSON.stringify(result, null, 2));
console.log("");

if (!result.success) {
    console.log(
        "RC214 ALIGN RC212 COOPERATIVE OWNERSHIP CONTRACT: FAIL"
    );
    process.exitCode = 1;
} else {
    console.log(
        "RC214 ALIGN RC212 COOPERATIVE OWNERSHIP CONTRACT: PASS"
    );
}

console.log("==================================================");
