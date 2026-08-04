/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Developer Tools
 *
 * File: patchService.js
 * Version: 1.0.0
 *
 * Patch Service
 * =====================================================
 */

import { CMPPatchRepository }
    from "./patchRepository.js";

const repository =
    new CMPPatchRepository();

export async function applyPatch(data) {

    if (!data?.path) {

        throw new Error(
            "File path is required."
        );

    }

    if (!data?.search) {

        throw new Error(
            "Search text is required."
        );

    }

    if (data.replace == null) {

        throw new Error(
            "Replacement text is required."
        );

    }

    const exists =
        await repository.exists(data.path);

    if (!exists) {

        throw new Error(
            "Target file does not exist."
        );

    }


    const content =
        await repository.readFile(
            data.path        );

    if (!content.includes(data.search)) {

        throw new Error(
            "Search text not found."
        );

    }

const backup =
        await repository.backupFile(
            data.path
        );

    const updated =
        content.replace(
            data.search,
            data.replace
        );

    await repository.writeFile(
        data.path,
        updated
    );

    return {

        success: true,
        backup,

        message:
            "Patch applied successfully."

    };

}
