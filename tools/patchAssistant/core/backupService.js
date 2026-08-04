/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Developer Tools
 *
 * File: backupService.js
 * Version: 2.0.0
 *
 * Patch Backup Service
 * =====================================================
 */

import { CMPPatchRepository }
    from "../patchRepository.js";

const repository =
    new CMPPatchRepository();


export async function createBackup(
    path
) {

    const exists =
        await repository.exists(path);

    if (!exists) {

        throw new Error(
            "Target file does not exist."
        );

    }


    return await repository.backupFile(
        path
    );

}
