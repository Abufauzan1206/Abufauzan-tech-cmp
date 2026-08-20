/**
 * =====================================================
 * ABUFAUZAN TECH CMP
 * RC033 - FIX OPENING BALANCE ASYNC
 * =====================================================
 */

import fs from "fs";

const file =
    "js/business/openingBalanceEngine.js";

function patch() {

    const source =
        fs.readFileSync(file, "utf8");

    let text = source;

    text = text.replace(
        'import { CMPTrialBalanceEngine } from "./trialBalanceEngine.js";',
        'import { generateTrialBalance } from "./trialBalanceEngine.js";'
    );

    text = text.replace(
        '    static generate() {',
        '    static async generate() {'
    );

    text = text.replace(
        'const trialBalance =\n            CMPTrialBalanceEngine.generate();',
        'const trialBalance =\n            await generateTrialBalance();'
    );

    if (text === source) {
        throw new Error(
            "No expected opening balance patterns were changed."
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
    console.log("RC033 - FIX OPENING BALANCE ASYNC");
    console.log("=========================================");

    console.log("");
    console.log("PATCH:", file);

    const result = patch();

    console.log(result);

    console.log("");
    console.log("RC033 PATCH: PASS");

} catch (error) {

    console.log("RC033 PATCH: FAIL");
    console.log(error.message);

}
