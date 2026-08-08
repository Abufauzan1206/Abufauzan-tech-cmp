/**
 * =====================================================
 * ABUFAUZAN TECH CMP
 *
 * RC017A Cash Account Fix Patch
 * =====================================================
 */

import {
    patch
} from "../patchEngine.js";


async function run() {

    console.log(
        "========================================="
    );

    console.log(
        "RC017A CASH ACCOUNT FIX"
    );

    console.log(
        "========================================="
    );


    const result =
        await patch({

            path:
                "testLedgerDuplicateRC017A.html",

            search:
                `"Cash"`,

            replace:
                `"Cash Account"`

        });


    console.log(
        "PATCH: PASS"
    );


    console.log(
        JSON.stringify(
            result,
            null,
            4
        )
    );

}


run();
