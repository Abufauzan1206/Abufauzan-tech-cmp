/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Developer Tools
 *
 * File: rc040BankBookAccountNamePatch.js
 * Version: 1.0.0
 *
 * RC040 - Bank Book Account Name Alignment Patch
 * =====================================================
 */

import { patch } from "../patchEngine.js";

const file =
    "js/business/bankBookEngine.js";

async function run() {

    console.log(
        "========================================="
    );

    console.log(
        "ABUFAUZAN TECH CMP"
    );

    console.log(
        "RC040 - BANK BOOK ACCOUNT NAME PATCH"
    );

    console.log(
        "========================================="
    );

    try {

        const result =
            await patch({

                path: file,

                search:
`await generateGeneralLedger("Bank");`,

                replace:
`await generateGeneralLedger("Bank Account");`

            });

        console.log(
            "BANK BOOK ACCOUNT PATCH: PASS"
        );

        console.log(result);

    }
    catch (error) {

        console.log(
            "PATCH FAIL"
        );

        console.log(
            error.message
        );

        process.exitCode = 1;

    }

}

run();
