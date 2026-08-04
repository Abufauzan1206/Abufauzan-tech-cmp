/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Developer Tools Test
 *
 * File: testPatchAssistant.js
 * Version: 1.0.0
 *
 * Patch Assistant Integration Test
 * =====================================================
 */

import { patch } from "../patchEngine.js";
import fs from "fs/promises";

let report = "";

try {

    report +=
        "=========================================\n";
    report +=
        "ABUFAUZAN TECH CMP\n";
    report +=
        "PATCH ASSISTANT TEST\n";
    report +=
        "=========================================\n\n";

    const result =
        await patch({

            path:
                "./tools/patchAssistant/test/sample.txt",

            search:
                "Developer",

            replace:
                "Engineer"

        });

    report +=
        "PATCH(): PASS\n";

    report +=
        JSON.stringify(
            result,
            null,
            4
        );

    report += "\n\n";

    const content =
        await fs.readFile(
            "./tools/patchAssistant/test/sample.txt",
            "utf8"
        );

    if (
        content.includes("Engineer")
    ) {

        report +=
            "VERIFY PATCH: PASS\n";

    }
    else {

        report +=
            "VERIFY PATCH: FAIL\n";

    }

}
catch (error) {

    report +=
        "TEST FAIL\n\n";

    report +=
        error.message;

}

report +=
    "\n\n=========================================\n";

report +=
    "TEST COMPLETE\n";

report +=
    "=========================================\n";

console.log(report);
