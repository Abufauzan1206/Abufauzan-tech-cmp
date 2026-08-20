/**
 * =====================================================
 * ABUFAUZAN TECH CMP
 * RC034 - FIX FINANCIAL CLOSING IMPORTS
 * =====================================================
 */

import fs from "fs";

const file =
    "js/business/financialClosingCoordinator.js";

function patch() {

    const source =
        fs.readFileSync(file, "utf8");

    let text = source;

    text = text.replace(
        /import \{ CMPTrialBalanceEngine \}[\s\S]*?from "\.\/trialBalanceEngine\.js";/,
        'import { generateTrialBalance } from "./trialBalanceEngine.js";'
    );

    text = text.replace(
        /import \{ CMPFinancialYearEngine \}[\s\S]*?from "\.\/financialYearEngine\.js";/,
        'import { closeYear } from "./financialYearEngine.js";'
    );

    if (text === source) {
        throw new Error(
            "No expected coordinator import patterns were changed."
        );
    }

    fs.copyFileSync(
        file,
        file + ".bak"
    );

    fs.writeFileSync(
        file,
        text
    );

    return {
        success: true,
        backup: file + ".bak",
        strategy: "regex-exact"
    };

}

try {

    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC034 - FIX FINANCIAL CLOSING IMPORTS");
    console.log("=========================================");

    console.log("");
    console.log("PATCH:", file);

    const result = patch();

    console.log(result);

    console.log("");
    console.log("RC034 PATCH: PASS");

} catch (error) {

    console.log("RC034 PATCH: FAIL");
    console.log(error.message);

}
