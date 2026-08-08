/**
 * =====================================================
 * ABUFAUZAN TECH CMP
 *
 * RC017A Test Account Fix Patch
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
        "RC017A TEST ACCOUNT FIX"
    );

    console.log(
        "========================================="
    );


    const result =
        await patch({

            path:
                "testLedgerDuplicateRC017A.html",

            search:
                `"Capital"`,

            replace:
                `"Members Capital"`

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
