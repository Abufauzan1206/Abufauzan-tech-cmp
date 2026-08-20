/**
 * =====================================================
 * ABUFAUZAN TECH CMP
 * RC035 - FIX FINANCIAL CLOSING COORDINATOR TEST
 * =====================================================
 */

import fs from "fs";

const file =
    "testFinancialClosingCoordinator.js";

function patch() {

    const source =
        fs.readFileSync(file, "utf8");

    let text = source;

    text = text.replace(
        'import { CMPTransactionEngine } from "./js/business/transactionEngine.js";',
        'import { CMPTransactionEngine } from "./js/business/transactionEngine.js";\nimport { createYear } from "./js/business/financialYearEngine.js";'
    );

    text = text.replace(
        'const report =\n    CMPFinancialClosingCoordinator.close(2026);',
        `const financialYear =
    await createYear({
        name: "FY 2026 RC",
        startDate: "2026-01-01",
        endDate: "2026-12-31"
    });

const report =
    await CMPFinancialClosingCoordinator.close(
        financialYear.id,
        2026
    );`
    );

    if (text === source) {
        throw new Error(
            "No expected coordinator test patterns were changed."
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
    console.log("RC035 - FIX FINANCIAL CLOSING TEST");
    console.log("=========================================");

    console.log("");

    const result = patch();

    console.log(result);

    console.log("");

    console.log("RC035 PATCH: PASS");

} catch (error) {

    console.log("RC035 PATCH: FAIL");
    console.log(error.message);

}
