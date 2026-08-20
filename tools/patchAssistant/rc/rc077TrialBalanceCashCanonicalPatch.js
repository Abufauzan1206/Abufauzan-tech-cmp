/**
 * =========================================
 * ABUFAUZAN TECH CMP
 * RC077 TRIAL BALANCE CASH CANONICAL PATCH
 * =========================================
 */

import { patch } from "../patchEngine.js";

async function run() {

    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC077 TRIAL BALANCE CASH CANONICAL PATCH");
    console.log("=========================================");

    try {

        const result = await patch({

            path: "js/business/trialBalanceEngine.js",

            search: `const accountName =
                entry.account === "Cash"
                    ? "Cash Account"
                    : entry.account;`,

            replace: `const accountName =
                entry.account;`,

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
