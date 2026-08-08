import fs from "fs/promises";
import { transaction } from "../patchEngine.js";

async function run() {

    console.log("=========================================");
    console.log("PATCH TRANSACTION ROLLBACK TEST");
    console.log("=========================================");

    const fileA =
        "tools/patchAssistant/test/rollbackA.txt";

    const fileB =
        "tools/patchAssistant/test/rollbackB.txt";

    await fs.writeFile(
        fileA,
        "ORIGINAL-A",
        "utf8"
    );

    await fs.writeFile(
        fileB,
        "ORIGINAL-B",
        "utf8"
    );

    const result =
        await transaction([

            {
                path: fileA,

                search: "ORIGINAL-A",

                replace: "MODIFIED-A"
            },

            {
                path: fileB,

                search: "THIS-WILL-NOT-MATCH",

                replace: "MODIFIED-B"
            }

        ]);

    const restoredA =
        await fs.readFile(
            fileA,
            "utf8"
        );

    console.log(
        "TRANSACTION SUCCESS:",
        result.success
    );

    console.log(
        "FILE A:",
        restoredA
    );

    if (
        result.success === false &&
        restoredA === "ORIGINAL-A"
    ) {

        console.log("ROLLBACK: PASS");

    }
    else {

        console.log("ROLLBACK: FAIL");

    }

    await fs.unlink(fileA);

    try {
        await fs.unlink(`${fileA}.bak`);
    }
    catch {}

    await fs.unlink(fileB);

    try {
        await fs.unlink(`${fileB}.bak`);
    }
    catch {}

}

run().catch(error => {

    console.error("TEST FAIL");
    console.error(error);

    process.exit(1);

});
