import { transaction } from "../patchEngine.js";

const targetFile = "js/business/financialClosingCoordinator.js";

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC054 - FIX FINANCIAL YEAR REPORT IMPORT");
    console.log("=========================================");

    const result = await transaction([
        {
            path: targetFile,
            mode: "regex",
            search:
                'import \\{ closeYear, getFinancialYearById \\} from "\\.\\/financialYearEngine\\.js";',
            replace:
                'import { closeYear } from "./financialYearEngine.js";\nimport { getFinancialYearById } from "../services/financialYearService.js";'
        }
    ]);

    console.log("RC054 TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;
        console.log("=========================================");
        console.log("RC054 PATCH FAIL");
        console.log("=========================================");
        return;
    }

    console.log("=========================================");
    console.log("RC054 PATCH COMPLETE");
    console.log("=========================================");
}

run();
