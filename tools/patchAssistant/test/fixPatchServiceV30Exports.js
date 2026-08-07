/**
 * =====================================================
 * ABUFAUZAN TECH CMP
 *
 * Patch Assistant Repair
 *
 * Restore patchService v3.0.0 exports
 * =====================================================
 */

import fs from "fs/promises";

const file =
    "tools/patchAssistant/patchService.js";


async function run() {

    console.log(
        "========================================="
    );

    console.log(
        "PATCH SERVICE EXPORT REPAIR"
    );

    console.log(
        "========================================="
    );


    const content =
        await fs.readFile(
            file,
            "utf8"
        );


    const updated =
        content.replace(
            /async function applySinglePatch/,
            `export async function applyPatch(data) {

    return await applySinglePatch(data);

}


async function applySinglePatch`
        );


    await fs.writeFile(
        file,
        updated,
        "utf8"
    );


    const verify =
        await fs.readFile(
            file,
            "utf8"
        );


    if (
        verify.includes(
            "export async function applyPatch"
        )
    ) {

        console.log(
            "EXPORT RESTORE: PASS"
        );

    }
    else {

        throw new Error(
            "Export restore failed."
        );

    }

}


run();
