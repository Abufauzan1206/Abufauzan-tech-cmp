/**
 * =========================================
 * ABUFAUZAN TECH CMP
 * RC075 BANK CANONICAL ACCOUNT PATCH
 * =========================================
 */

import { patch } from "../patchEngine.js";

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC075 BANK CANONICAL ACCOUNT PATCH");
    console.log("=========================================");

    try {

        const result = await patch({
            path: "js/business/chartOfAccounts.js",

            search: `BANK: {
        code: "1002",
        name: "Bank",
        type: CMPAccountTypes.TYPES.ASSET
    },`,

            replace: `BANK: {
        code: "1002",
        name: "Bank Account",
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
