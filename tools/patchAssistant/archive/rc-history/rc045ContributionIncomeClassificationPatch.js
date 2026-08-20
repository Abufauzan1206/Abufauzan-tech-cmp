import { transaction } from "../patchEngine.js";

const file =
    "js/business/accountClassificationEngine.js";

async function run() {

    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC045 - CONTRIBUTION INCOME CLASSIFICATION");
    console.log("=========================================");

    const result = await transaction([
        {
            path: file,
            mode: "regex",
            search:
                '(CONTRIBUTION:\\s*\\{\\s*category:\\s*)"EQUITY"',
            replace:
                '$1"INCOME"'
        }
    ]);

    console.log("RC045 TRANSACTION RESULT:");
    console.log(
        JSON.stringify(result, null, 2)
    );

    if (!result.success) {
        process.exitCode = 1;
        return;
    }

    console.log("=========================================");
    console.log("RC045 PATCH COMPLETE");
    console.log("=========================================");
}

run();
