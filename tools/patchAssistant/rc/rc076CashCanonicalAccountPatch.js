/**
 * =========================================
 * ABUFAUZAN TECH CMP
 * RC076 CASH CANONICAL ACCOUNT PATCH
 * =========================================
 */

import { patch } from "../patchEngine.js";

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC076 CASH CANONICAL ACCOUNT PATCH");
    console.log("=========================================");

    try {
        const result = await patch({
            path: "js/business/chartOfAccounts.js",

            search: `CASH: {
        code: "1001",
        name: "Cash",
        type: CMPAccountTypes.TYPES.ASSET
    },`,

            replace: `CASH: {
        code: "1001",
        name: "Cash Account",
        type: CMPAccountTypes.TYPES.ASSET
    },`,

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
