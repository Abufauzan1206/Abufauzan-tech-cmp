/**
 * =========================================
 * ABUFAUZAN TECH CMP
 * Patch Repository Restore Test
 * =========================================
 */

import fs from "fs/promises";
import { CMPPatchRepository } from "../patchRepository.js";

const repository = new CMPPatchRepository();

async function run() {

    console.log("=========================================");
    console.log("PATCH REPOSITORY RESTORE TEST");
    console.log("=========================================");

    const file =
        "tools/patchAssistant/test/tempRestore.txt";

    await fs.writeFile(
        file,
        "ORIGINAL",
        "utf8"
    );

    await repository.backupFile(file);

    await fs.writeFile(
        file,
        "MODIFIED",
        "utf8"
    );

    await repository.restoreBackup(file);

    const restored =
        await fs.readFile(
            file,
            "utf8"
        );
    if (restored === "ORIGINAL") {

        console.log("RESTORE: PASS");

    }
    else {

        console.log("RESTORE: FAIL");
        console.log(restored);

    }

    await fs.unlink(file);
    await fs.unlink(`${file}.bak`);

}

run().catch(error => {

    console.error(error);

    process.exit(1);

});
