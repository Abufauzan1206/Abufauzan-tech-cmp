/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Developer Tools
 *
 * File: rollbackService.js
 * Version: 1.0.0
 *
 * Transaction Rollback Service
 * =====================================================
 */

import { CMPPatchRepository }
    from "./patchRepository.js";

const repository =
    new CMPPatchRepository();

export async function rollback(
    patches = []
) {
    const restored = [];

    for (
        let i = patches.length - 1;
        i >= 0;
        i--
    ) {

        const item =
            patches[i];

        if (!item?.path) {

            continue;

        }

        try {

            await repository.restoreBackup(
                item.path
            );

            restored.push(
                item.path
            );

        }
        catch {

            // Ignore missing backups
        }

    }
    return {

        success: true,

        restored

    };

}
