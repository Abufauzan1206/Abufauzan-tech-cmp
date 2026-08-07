/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC016A - Duplicate Journal Test Diagnostic Patch
 *
 * File:
 * rc016ADuplicateJournalTestDiagnosticPatch.js
 * =====================================================
 */

import fs from "fs";

const TARGET_FILE =
    "testDuplicateJournalRC016A.html";


async function run() {

    console.log(
        "========================================="
    );

    console.log(
        "ABUFAUZAN TECH CMP"
    );

    console.log(
        "RC016A - TEST DIAGNOSTIC PATCH"
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
`    await postJournal(
        request
    );

    print(
        "\\nFIRST JOURNAL: PASS"
    );`;

        const replacement =
`    try {

        await postJournal(
            request
        );

        print(
            "\\nFIRST JOURNAL: PASS"
        );

    }

    catch (error) {

        print(
            "\\nFIRST JOURNAL: FAIL"
        );

        print(
            error.message
        );

        return;

    }`;

        if (!content.includes(search)) {

            throw new Error(
                "Target block not found."
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
