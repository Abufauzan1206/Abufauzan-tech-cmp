/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC016A Import Fix Patch
 * =====================================================
 */

import fs from "fs";

const TARGET_FILE =
    "js/business/journalPostingEngine.js";

async function run() {

    console.log(
        "========================================="
    );

    console.log(
        "ABUFAUZAN TECH CMP"
    );

    console.log(
        "RC016A IMPORT FIX"
    );

    console.log(
        "========================================="
    );

    try {

        let content =
            fs.readFileSync(
                TARGET_FILE,
                "utf8"
            );
        const search =
`import {
    createJournal
} from "../services/journalService.js";`;

        const replacement =
`import {
    createJournal,
    findJournalByReference
} from "../services/journalService.js";`;

        if (!content.includes(search)) {

            throw new Error(
                "Import block not found."
            );

        }

        content =
            content.replace(
                search,
                replacement
            );
        fs.writeFileSync(
            TARGET_FILE,
            content,
            "utf8"
        );

        console.log(
            "PATCH: PASS"
        );

    }

    catch (error) {

        console.log(
            "PATCH FAIL"
        );

        console.log(
            error.message
        );

    }

}

run();
