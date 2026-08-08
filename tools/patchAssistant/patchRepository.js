/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Developer Tools
 *
 * File: patchRepository.js
 * Version: 1.0.0
 *
 * Patch Repository
 * =====================================================
 */

import fs from "fs/promises";

export class CMPPatchRepository {

    async readFile(path) {

        return await fs.readFile(
            path,
            "utf8"
        );

    }

    async writeFile(
        path,
        content
    ) {

        await fs.writeFile(
            path,
            content,
            "utf8"
        );

        return true;

    }

    async backupFile(path) {

        const content =
            await this.readFile(path);

        await this.writeFile(
            `${path}.bak`,
            content
        );

        return `${path}.bak`;

    }

async restoreBackup(path) {

    const backupPath =
        `${path}.bak`;

    if (!(await this.exists(backupPath))) {

        throw new Error(
            "Backup file does not exist."
        );

    }

    const content =
        await this.readFile(
            backupPath
        );

    await this.writeFile(
        path,
        content
    );

    return true;

}

    async exists(path) {

        try {

            await fs.access(path);

            return true;

        }
        catch {

            return false;

        }

    }
}
