/**
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


export async function applyPatch(data) {

    return await applySinglePatch(data);

}


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
