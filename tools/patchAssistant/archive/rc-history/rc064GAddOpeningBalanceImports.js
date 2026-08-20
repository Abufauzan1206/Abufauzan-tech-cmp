import { transaction } from "../patchEngine.js";

const target = "testOpeningBalance.js";

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC064G - ADD OPENING BALANCE IMPORTS");
    console.log("=========================================");

    const result = await transaction([
        {
            path: target,
            mode: "exact",
            search: `import { CMPOpeningBalanceEngine } from "./js/business/openingBalanceEngine.js";`,
            replace: `import { CMPOpeningBalanceEngine } from "./js/business/openingBalanceEngine.js";
import { seedChartOfAccounts } from "./js/seeders/chartOfAccountsSeeder.js";
import { createPeriod } from "./js/business/accountingPeriodEngine.js";
import { createYear } from "./js/business/financialYearEngine.js";`
        }
    ]);

    console.log("RC064G TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;
        console.log("=========================================");
        console.log("RC064G PATCH FAIL");
        console.log("=========================================");
        return;
    }

    console.log("=========================================");
    console.log("RC064G PATCH COMPLETE");
    console.log("=========================================");
}

run();
