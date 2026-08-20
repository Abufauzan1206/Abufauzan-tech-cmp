import { transaction } from "../patchEngine.js";

const targetFile = "js/business/financialClosingCoordinator.js";

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC053 - FIX FINANCIAL YEAR REPORT");
    console.log("=========================================");

    const result = await transaction([
        {
            path: targetFile,
            mode: "regex",
            search:
                'import \\{ closeYear \\} from "\\.\\/financialYearEngine\\.js";',
            replace:
                'import { closeYear, getFinancialYearById } from "./financialYearEngine.js";'
        },
        {
            path: targetFile,
            mode: "regex",
            search:
                'const financialYear =\\s*await closeYear\\(\\s*financialYearId\\s*\\);',
            replace:
                `await closeYear(financialYearId);

        const financialYear =
            await getFinancialYearById(financialYearId);`
        }
    ]);

    console.log("RC053 TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;
        console.log("=========================================");
        console.log("RC053 PATCH FAIL");
        console.log("=========================================");
        return;
    }

    console.log("=========================================");
    console.log("RC053 PATCH COMPLETE");
    console.log("=========================================");
}

run();
