/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Developer Tools
 *
 * File: registerBudgetRepositoryPatch.js
 * Version: 1.0.0
 *
 * Register Budget Repository Patch
 * =====================================================
 */

import { patch } from "../patchEngine.js";

const file =
    "js/repositories/repositoryManager.js";


async function run() {

    console.log(
        "========================================="
    );

    console.log(
        "ABUFAUZAN TECH CMP"
    );

    console.log(
        "REGISTER BUDGET REPOSITORY PATCH"
    );

    console.log(
        "========================================="
    );


    try {

        const result =
            await patch({

                path: file,

                search:
`this.register(
            "financialYear",
            this.financialYear
        );`,

                replace:
`this.register(
            "financialYear",
            this.financialYear
        );

        this.register(
            "budget",
            this.budget
        );`

            });


        console.log(
            "REGISTER PATCH: PASS"
        );

        console.log(result);


    }
    catch(error) {

        console.log(
            "PATCH FAIL"
        );

        console.log(
            error.message
        );

    }

}


run();
