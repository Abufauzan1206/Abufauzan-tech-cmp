/**
 * =====================================================
 * ABUFAUZAN TECH CMP
 * RC032 - FIX FINANCIAL CLOSING COORDINATOR API
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
        'import { CMPTrialBalanceEngine }\nfrom "./trialBalanceEngine.js";',
        'import { generateTrialBalance }\nfrom "./trialBalanceEngine.js";'
    );

    text = text.replace(
        'import { CMPFinancialYearEngine }\nfrom "./financialYearEngine.js";',
        'import { closeYear }\nfrom "./financialYearEngine.js";'
    );

    text = text.replace(
        '    static close(year) {',
        '    static async close(financialYearId, year) {'
    );

    text = text.replace(
        'const trialBalance =\n            CMPTrialBalanceEngine.generate();',
        'const trialBalance =\n            await generateTrialBalance();'
    );

    text = text.replace(
        'const closingJournal =\n            CMPClosingJournalEngine.generate();',
        'const closingJournal =\n            await CMPClosingJournalEngine.generate();'
    );

    text = text.replace(
        'const openingBalance =\n            CMPOpeningBalanceEngine.generate();',
        'const openingBalance =\n            await CMPOpeningBalanceEngine.generate();'
    );

    text = text.replace(
        'const financialYear =\n            CMPFinancialYearEngine.close(\n                year\n            );',
        'const financialYear =\n            await closeYear(\n                financialYearId\n            );'
    );

    if (text === source) {
        throw new Error(
            "No expected coordinator patterns were changed."
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
        strategy: "exact"
    };

}

try {

    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC032 - FIX FINANCIAL CLOSING COORDINATOR");
    console.log("=========================================");

    console.log("");
    console.log("PATCH:", file);

    const result = patch();

    console.log(result);

    console.log("");
    console.log("RC032 PATCH: PASS");

} catch (error) {

    console.log("RC032 PATCH: FAIL");
    console.log(error.message);

}
