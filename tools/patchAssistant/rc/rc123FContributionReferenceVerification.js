import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "testGeneralLedgerTransactionIntegration.js",
        mode: "regex",
        search: String.raw`const transaction\s*=\s*await CMPTransactionEngine\.create\(\{[\s\S]*?\}\);`,
        replace: `const transaction = await CMPTransactionEngine.create({
            type: "CONTRIBUTION",
            amount: 10000,
            memberId: "MEMBER001",
            reference: "CON-REFERENCE-001",
            description: "Contribution Reference Verification",
            account: "Cash Account",
            createdBy: "CMP"
        });`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC123F - CONTRIBUTION REFERENCE VERIFICATION PATCH");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC123F TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;
        console.log("=========================================");
        console.log("RC123F PATCH FAIL");
        console.log("=========================================");
        return;
    }

    console.log("=========================================");
    console.log("RC123F PATCH COMPLETE");
    console.log("=========================================");
}

run();
