/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Developer Tools
 *
 * File: rc028FixMemoryFactoryPatch.js
 * Version: 1.0.0
 *
 * RC028 - Fix Memory Factory Method Patch
 * =====================================================
 */

import { patch } from "../patchEngine.js";

const file =
    "tools/patchAssistant/test/addMemoryFactoryMethodPatch.js";

async function run() {

    console.log(
        "========================================="
    );

    console.log(
        "ABUFAUZAN TECH CMP"
    );

    console.log(
        "RC028 - FIX MEMORY FACTORY PATCH"
    );

    console.log(
        "========================================="
    );

    try {

        const result =
            await patch({

                path: file,

                mode: "regex",

                search:
                    "search:\\s*`static firebase\\(collectionName\\) \\{[\\s\\S]*?\\}`,",

                replace:
                    "search:\n`static firebase(collectionName) {`,"

            });

        console.log(
            "PATCH ASSISTANT FIX: PASS"
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

    }
}

run();
