import { transaction } from "../patchEngine.js";

const file =
    "js/business/accountClassificationEngine.js";

async function run() {

    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC046 - MEMBERS CAPITAL CLASSIFICATION");
    console.log("=========================================");

    const result = await transaction([
        {
            path: file,
            mode: "regex",

            search:
                'CONTRIBUTION:\\s*\\{[\\s\\S]*?normalBalance:\\s*"CREDIT"\\s*\\}',

            replace:
                `CONTRIBUTION: {
            category: "INCOME",
            statement: "INCOME_EXPENDITURE",
            cashFlow: "OPERATING",
            normalBalance: "CREDIT"
        },

        MEMBERS: {
            category: "EQUITY",
            statement: "BALANCE_SHEET",
            cashFlow: "FINANCING",
            normalBalance: "CREDIT"
        }`
        }
    ]);

    console.log("RC046 TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;
        return;
    }

    console.log("=========================================");
    console.log("RC046 PATCH COMPLETE");
    console.log("=========================================");
}

run();
