import { transaction } from "../patchEngine.js";

const patches = [

    // =====================================================
    // 1. CONTRIBUTION POSTING ENGINE
    // Replace direct transaction service with the
    // canonical CMPTransactionEngine.
    // =====================================================
    {
        path: "js/business/contributionPostingEngine.js",
        mode: "regex",
        search: String.raw`import \{\s*createTransaction\s*\} from "\.\./services/transactionService\.js";`,
        replace: `import {
    CMPTransactionEngine
} from "./transactionEngine.js";`
    },

    // =====================================================
    // 2. USE TRANSACTION ENGINE
    // =====================================================
    {
        path: "js/business/contributionPostingEngine.js",
        mode: "regex",
        search: String.raw`const transactionResult\s*=\s*await createTransaction\(\{\s*type:\s*"CONTRIBUTION",\s*amount:\s*data\.amount,\s*memberId:\s*data\.memberId,\s*reference:\s*contributionNumber,\s*status:\s*"SUCCESS"\s*\}\);`,
        replace: `const transactionResult =
        await CMPTransactionEngine.create({
            type: "CONTRIBUTION",
            amount: data.amount,
            memberId: data.memberId,
            reference: contributionNumber,
            description: "Member Contribution",
            account: "Cash Account",
            createdBy: data.createdBy ?? "CMP"
        });`
    }

];

async function run() {

    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC122 - CONTRIBUTION CANONICAL TRANSACTION PATCH");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC122 TRANSACTION RESULT:");
    console.log(
        JSON.stringify(result, null, 2)
    );

    if (!result.success) {
        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC122 PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC122 PATCH COMPLETE");
    console.log("=========================================");
}

run();
