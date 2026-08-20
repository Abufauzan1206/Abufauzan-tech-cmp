import { transaction } from "../patchEngine.js";

const file =
    "js/business/financialClosingCoordinator.js";

async function run() {

    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC045 - FIX FINANCIAL CLOSING COORDINATOR SYNTAX");
    console.log("=========================================");

    const result = await transaction([
        {
            path: file,
            mode: "regex",
            search: '\\nfrom "\\./auditTrailEngine\\.js";',
            replace: ''
        }
    ]);

    console.log("RC045 TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;
        return;
    }

    console.log("=========================================");
    console.log("RC045 PATCH COMPLETE");
    console.log("=========================================");
}

run();
