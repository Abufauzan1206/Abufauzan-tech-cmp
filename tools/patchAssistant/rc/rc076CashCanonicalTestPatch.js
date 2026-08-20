/**
 * =========================================
 * ABUFAUZAN TECH CMP
 * RC076 CASH CANONICAL TEST PATCH
 * =========================================
 */

import { patch } from "../patchEngine.js";

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC076 CASH CANONICAL TEST PATCH");
    console.log("=========================================");

    try {
        const result = await patch({
            path: "testChartOfAccounts.js",

            search: `CMPChartOfAccountsEngine.createAccount({

    code: "1000",
    name: "Cash",
    category: "ASSET"

});`,

            replace: `CMPChartOfAccountsEngine.createAccount({

    code: "1000",
    name: "Cash Account",
    category: "ASSET"

});`,

            ignoreWhitespace: true
        });

        console.log("PATCH: PASS");
        console.log(JSON.stringify(result, null, 4));

    } catch (error) {
        console.log("PATCH FAIL");
        console.log(error.message);
        process.exit(1);
    }
}

run();
