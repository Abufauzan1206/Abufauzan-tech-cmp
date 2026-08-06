/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC Patch #014C
 *
 * File: rc014CSandboxAwareJournalPatch.js
 * Version: 1.0.0
 *
 * Sandbox-Aware Journal Posting
 * =====================================================
 */

import { patch } from "../patchEngine.js";

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
        "RC014C - SANDBOX AWARE JOURNAL"
    );

    console.log(
        "========================================="
    );

    try {

        await patch({

            path: TARGET_FILE,

            search: `import {
    generateDocumentNumber
} from "../utils/generator.js";`,

            replace: `import {
    generateDocumentNumber
} from "../utils/generator.js";

import {
    isSandboxActive,
    getCurrentSandbox
} from "../utils/sandboxManager.js";`

        });
        await patch({

            path: TARGET_FILE,

            search: `const journal = {

        ...data,

        accountingPeriod:
            period.name,

        journalNumber,

        status:
            "POSTED",

        createdAt:
            new Date().toISOString()

    };`,

            replace: `const sandbox =
        isSandboxActive()
            ? getCurrentSandbox()
            : null;

    const journal = {

        ...data,

        ...(sandbox
            ? {
                sandboxId:
                    sandbox.sandboxId
            }
            : {}),

        accountingPeriod:
            period.name,

        journalNumber,

        status:
            "POSTED",

        createdAt:
            new Date().toISOString()

    };`

        });

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
