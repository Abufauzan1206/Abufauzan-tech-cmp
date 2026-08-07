/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Developer Tools
 *
 * File: upgradePatchEngineV20.js
 *
 * Patch Assistant Upgrade
 * patchEngine v1.0.0 -> v2.0.0
 * =====================================================
 */

import fs from "fs/promises";

const TARGET =
    "tools/patchAssistant/patchEngine.js";

const BACKUP =
    "tools/patchAssistant/patchEngine.v20.migration.bak";


async function run() {

    console.log(
        "========================================="
    );

    console.log(
        "ABUFAUZAN TECH CMP"
    );

    console.log(
        "UPGRADE PATCH ENGINE V2.0.0"
    );

    console.log(
        "========================================="
    );


    try {

        const content =
            await fs.readFile(
                TARGET,
                "utf8"
            );
        if (
            !content.includes(
                "Version: 1.0.0"
            )
        ) {

            throw new Error(
                "Current patchEngine version mismatch."
            );

        }


        await fs.writeFile(
            BACKUP,
            content,
            "utf8"
        );


        console.log(
            "BACKUP: PASS"
        );


        const upgraded =
`/**
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

        }


        return {

            success: true,

            count:
                results.length,

            results

        };

    }
    catch(error) {

        return {

            success: false,

            error:
                error.message,

            results

        };

    }

}
`;
        await fs.writeFile(
            TARGET,
            upgraded,
            "utf8"
        );


        const verify =
            await fs.readFile(
                TARGET,
                "utf8"
            );


        if (
            !verify.includes(
                "Version: 2.0.0"
            )
        ) {

            throw new Error(
                "Patch engine verification failed."
            );

        }


        console.log(
            "UPGRADE: PASS"
        );


        console.log(
            "VERIFY: PASS"
        );


        console.log(
            "PATCH ENGINE V2.0.0 READY"
        );


    }
    catch(error) {

        console.log(
            "UPGRADE: FAIL"
        );

        console.log(
            error.message
        );

    }

}


run();
