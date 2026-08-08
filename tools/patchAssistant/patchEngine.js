/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Developer Tools
 *
 * File: patchEngine.js
 * Version: 2.0.0
 *
 * Transaction Patch Engine
 * =====================================================
 */


import {
    applyPatch
} from "./patchService.js";

import {
    rollback
} from "./rollbackService.js";

export async function patch(data) {

    return await applyPatch(
        data
    );

}



export async function transaction(
    patches = []
) {

    if (
        !Array.isArray(patches) ||
        patches.length === 0
    ) {

        throw new Error(
            "Transaction patches required."
        );

    }


    const results = [];

const applied = [];

    try {

        for (
            const item of patches
        ) {

            const result =
                await applyPatch(
                    item
                );


            results.push(
                result
            );

applied.push(
    item
);

        }


        return {

            success: true,

            count:
                results.length,

            results

        };

    }

catch(error) {

    await rollback(
        applied
    );

    return {

        success: false,

        error:
            error.message,

        results

    };

}
}
