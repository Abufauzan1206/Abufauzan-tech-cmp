/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Developer Tools
 *
 * File: addMemoryFactoryMethodPatch.js
 * Version: 1.0.0
 *
 * Add Memory Factory Method Patch
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
        "ADD MEMORY FACTORY METHOD PATCH"
    );

    console.log(
        "========================================="
    );


    try {

        const result =
            await patch({

                path: file,

                search:
`static firebase(collectionName) {
        return new CMPFirebaseAdapter(collectionName);
    }`,

                replace:
`static firebase(collectionName) {
        return new CMPFirebaseAdapter(collectionName);
    }


    static memory(collectionName) {

        return new CMPMemoryAdapter(
            collectionName
        );

    }`

            });


        console.log(
            "METHOD PATCH: PASS"
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
