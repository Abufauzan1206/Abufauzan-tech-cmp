/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Developer Tools
 *
 * File: rc029RepairAdapterFactory.js
 * Version: 1.0.0
 *
 * RC029 - Repair Adapter Factory
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
        "RC029 - REPAIR ADAPTER FACTORY"
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
                    "export class CMPAdapterFactory \\{[\\s\\S]*?\\n\\}",

                replace:
`export class CMPAdapterFactory {

    static firebase(collectionName) {

        return new CMPFirebaseAdapter(collectionName);

    }

    static memory(collectionName) {

        return new CMPMemoryAdapter(
            collectionName
        );

    }

}`

            });

        console.log(
            "REPAIR PATCH: PASS"
        );

        console.log(result);

    }
    catch (error) {

        console.log(
            "REPAIR PATCH: FAIL"
        );

        console.log(
            error.message
        );

    }
}

run();
