/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Developer Tools
 *
 * File: addBudgetRepositoryPatch.js
 * Version: 1.0.0
 *
 * Add Budget Repository Patch
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
        "ADD BUDGET REPOSITORY PATCH"
    );

    console.log(
        "========================================="
    );


    try {

        const result =
            await patch({

                path: file,

                search:
                    'import { CMPFinancialYearRepository } from "./financialYearRepository.js";',

                replace:
                    'import { CMPFinancialYearRepository } from "./financialYearRepository.js";\nimport { CMPBudgetRepository } from "./budgetRepository.js";'

            });


        console.log(
            "IMPORT PATCH: PASS"
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
