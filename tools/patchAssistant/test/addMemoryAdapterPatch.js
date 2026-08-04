/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Developer Tools
 *
 * File: addMemoryAdapterPatch.js
 * Version: 1.0.0
 *
 * Add Memory Adapter Patch
 * =====================================================
 */

import { patch } from "../patchEngine.js";


const file =
    "js/adapters/adapterFactory.js";


async function run() {

    console.log(
        "========================================="
    );

    console.log(
        "ABUFAUZAN TECH CMP"
    );

    console.log(
        "ADD MEMORY ADAPTER PATCH"
    );

    console.log(
        "========================================="
    );


    try {

        const result =
            await patch({

                path: file,

                search:
`import { CMPFirebaseAdapter } from "./firebaseAdapter.js";`,

                replace:
`import { CMPFirebaseAdapter } from "./firebaseAdapter.js";
import { CMPMemoryAdapter } from "./memoryAdapter.js";`

            });


        console.log(
            "IMPORT PATCH: PASS"
        );

        console.log(result);


    }
    catch(error) {

        console.log(
            "PATCH FAIL"
        );

        console.log(
            error.message
        );

    }

}


run();
