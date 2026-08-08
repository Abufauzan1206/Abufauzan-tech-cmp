/**
 * =========================================
 * ABUFAUZAN TECH CMP
 * RC018B1 PATCH REPOSITORY RESTORE PATCH
 * =========================================
 */

import { patch } from "../patchEngine.js";

async function run() {

    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC018B1 PATCH REPOSITORY RESTORE PATCH");
    console.log("=========================================");

    try {

        const result = await patch({

            path:
                "tools/patchAssistant/patchRepository.js",

            search:
`    async exists(path) {

        try {

            await fs.access(path);

            return true;

        }
        catch {

            return false;

        }
    }`,

            replace:
`    async restoreFile(
        backup,
        path
    ) {

        const content =
            await this.readFile(
                backup
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
    }`

        });

        console.log("PATCH: PASS");
        console.log(JSON.stringify(result, null, 4));

    }
    catch (error) {

        console.log("PATCH FAIL");
        console.log(error.message);

    }

}

run();
