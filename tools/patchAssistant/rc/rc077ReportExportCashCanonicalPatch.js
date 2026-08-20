/**
 * =========================================
 * ABUFAUZAN TECH CMP
 * RC077 REPORT EXPORT CASH CANONICAL PATCH
 * =========================================
 */

import { patch } from "../patchEngine.js";

async function run() {

    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC077 REPORT EXPORT CASH CANONICAL PATCH");
    console.log("=========================================");

    try {

        const result = await patch({

            path: "testReportExport.js",

            search: `account: "Cash",`,

            replace: `account: "Cash Account",`,

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
