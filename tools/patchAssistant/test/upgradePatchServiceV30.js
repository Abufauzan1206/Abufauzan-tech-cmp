/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Developer Tools
 *
 * File: upgradePatchServiceV30.js
 *
 * Patch Assistant Upgrade
 * patchService v2.0.0 -> v3.0.0
 * =====================================================
 */

import fs from "fs/promises";

const TARGET =
    "tools/patchAssistant/patchService.js";

const BACKUP =
    "tools/patchAssistant/patchService.v30.migration.bak";


async function run() {

    console.log(
        "========================================="
    );

    console.log(
        "ABUFAUZAN TECH CMP"
    );

    console.log(
        "UPGRADE PATCH SERVICE V3.0.0"
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
                "Version: 2.0.0"
            )
        ) {

            throw new Error(
                "Current patchService version mismatch."
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
 * File: patchService.js
 * Version: 3.0.0
 *
 * Transactional Patch Service
 * =====================================================
 */

import { CMPPatchRepository }
    from "./patchRepository.js";

import {
    validatePatchRequest
} from "./core/validationService.js";

import {
    findMatch
} from "./core/matchingService.js";

import {
    replaceContent
} from "./core/replacementService.js";

import {
    createBackup
} from "./core/backupService.js";


const repository =
    new CMPPatchRepository();


async function applySinglePatch(data) {

    validatePatchRequest(
        data
    );


    const exists =
        await repository.exists(
            data.path
        );


    if (!exists) {

        throw new Error(
            "Target file does not exist."
        );

    }


    const content =
        await repository.readFile(
            data.path
        );


    const match =
        findMatch(
            content,
            data.search,
            {
                ignoreWhitespace:
                    data.ignoreWhitespace ?? false
            }
        );


    if (!match.found) {

        throw new Error(
            "Search text not found."
        );

    }


    const backup =
        await createBackup(
            data.path
        );


    const updated =
        replaceContent(
            content,
            data.search,
            data.replace,
            match
        );


    await repository.writeFile(
        data.path,
        updated
    );


    return {
        success: true,
        backup,
        strategy: match.strategy
    };

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
                "Version: 3.0.0"
            )
        ) {

            throw new Error(
                "Upgrade verification failed."
            );

        }


        console.log(
            "UPGRADE: PASS"
        );


        console.log(
            "VERIFY: PASS"
        );


        console.log(
            "PATCH SERVICE V3.0.0 READY"
        );


    }
    catch (error) {

        console.log(
            "UPGRADE: FAIL"
        );

        console.log(
            error.message
        );

    }

}


run();
