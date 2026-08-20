import { transaction } from "../patchEngine.js";

const coordinatorFile =
    "js/business/financialClosingCoordinator.js";

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC049 - FIX FINANCIAL YEAR PERIOD CREATION");
    console.log("=========================================");

    const result = await transaction([
        {
            path: coordinatorFile,
            mode: "regex",

            search:
                'name:\\s*`Accounting Period \\$\\{nextYear\\}`,\\\\n\\s*financialYearId:\\s*nextFinancialYear\\.id,\\\\n\\s*startDate:\\s*nextYearStart,\\\\n\\s*endDate:\\s*nextYearEnd',

            replace:
`name: \`Accounting Period \${nextYear}\`,
                    financialYearId:
                        nextFinancialYear.id,
                    startDate:
                        nextYearStart,
                    endDate:
                        nextYearEnd`
        },

        {
            path: coordinatorFile,
            mode: "regex",

            search:
                'import \\{\\s*postJournal\\s*\\} from "\\.\\/journalPostingEngine\\.js";[ \\t]+',

            replace:
`import {
    postJournal
} from "./journalPostingEngine.js";`
        }
    ]);

    console.log("RC049 TRANSACTION RESULT:");
    console.log(
        JSON.stringify(
            result,
            null,
            2
        )
    );

    if (!result.success) {
        process.exitCode = 1;
        console.log("=========================================");
        console.log("RC049 PATCH FAIL");
        console.log("=========================================");
        return;
    }

    console.log("=========================================");
    console.log("RC049 PATCH COMPLETE");
    console.log("=========================================");
}

run();
