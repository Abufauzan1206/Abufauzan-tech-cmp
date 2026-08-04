/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Developer Tools
 *
 * File: addBudgetInstancePatch.js
 * Version: 1.0.0
 *
 * Add Budget Repository Instance Patch
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
        "ADD BUDGET INSTANCE PATCH"
    );

    console.log(
        "========================================="
    );


    try {

        const result =
            await patch({

                path: file,

                search:
`static financialYear =
        new CMPFinancialYearRepository();`,

                replace:
`static financialYear =
        new CMPFinancialYearRepository();

    static budget =
        new CMPBudgetRepository();`

            });


        console.log(
            "INSTANCE PATCH: PASS"
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
