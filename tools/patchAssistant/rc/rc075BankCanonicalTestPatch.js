/**
 * =========================================
 * ABUFAUZAN TECH CMP
 * RC075 BANK CANONICAL TEST PATCH
 * =========================================
 */

import { patch } from "../patchEngine.js";

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC075 BANK CANONICAL TEST PATCH");
    console.log("=========================================");

    try {

        const result = await patch({
            path: "testBankBookEngine.js",

            search: `if (result.account !== "Bank") {
            throw new Error(
                \`Expected canonical account "Bank", received "\${result.account}".\`
            );
        }`,

            replace: `if (result.account !== "Bank Account") {
            throw new Error(
                \`Expected canonical account "Bank Account", received "\${result.account}".\`
            );
        }`,

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
