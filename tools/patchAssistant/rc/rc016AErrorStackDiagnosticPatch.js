/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC016A Error Stack Diagnostic Patch
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
        "RC016A ERROR STACK DIAGNOSTIC"
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
`        print(
            error.message
        );`;

        const replacement =
`        print(
            error.name
        );

        print(
            error.message
        );

        print(
            error.stack || "No stack available"
        );`;

        if (!content.includes(search)) {

            throw new Error(
                "Diagnostic target not found."
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
