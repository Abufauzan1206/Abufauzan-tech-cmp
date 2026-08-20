/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC082 VERIFICATION CHECKLIST
 *
 * Closing Journal
 * =====================================================
 */

import { spawn } from "child_process";

const checks = [
    {
        name: "RC081 Closing Journal",
        file: "testClosingJournal.js"
    }
];

async function run() {

    console.log(
        "========================================="
    );

    console.log(
        "ABUFAUZAN TECH CMP"
    );

    console.log(
        "RC082 VERIFICATION CHECKLIST"
    );

    console.log(
        "========================================="
    );

    let passed = 0;

    for (const check of checks) {

        try {

            await new Promise(
                (resolve, reject) => {

                    const child =
                        spawn(
                            "node",
                            [check.file],
                            {
                                stdio: "inherit"
                            }
                        );

                    child.on(
                        "error",
                        reject
                    );

                    child.on(
                        "close",
                        code => {

                            if (code === 0) {

                                resolve();

                            } else {

                                reject(
                                    new Error(
                                        `Test exited with code ${code}`
                                    )
                                );

                            }

                        }
                    );

                }
            );

            console.log(
                "PASS:",
                check.name
            );

            passed++;

        } catch (error) {

            console.log(
                "FAIL:",
                check.name
            );

            console.log(
                "ERROR:",
                error.message
            );

        }

    }

    console.log(
        "-----------------------------------------"
    );

    console.log(
        `RESULT: ${passed}/${checks.length} CHECKS PASSED`
    );

    console.log(
        "========================================="
    );

    if (
        passed !== checks.length
    ) {

        process.exit(1);

    }

}

run();
