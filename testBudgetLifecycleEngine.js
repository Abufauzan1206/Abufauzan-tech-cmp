/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Budget Lifecycle Engine Test
 *
 * File: testBudgetLifecycleEngine.js
 * Version: 1.0.0
 *
 * =====================================================
 */

import {
    createNewBudget,
    closeBudget,
    lockBudget,
    unlockBudget,
    reopenBudget
} from "./js/business/budgetEngine.js";


let report = "";


try {

    report +=
        "=========================================\n";

    report +=
        "ABUFAUZAN TECH CMP\n";

    report +=
        "BUDGET LIFECYCLE ENGINE TEST\n";

    report +=
        "=========================================\n\n";


    const created =
        await createNewBudget({

            financialYearId:
                "test-financial-year",

            name:
                "FY 2030 Operating Budget",

            amount:
                500000

        });


    report +=
        "CREATE BUDGET(): PASS\n";

    report +=
        JSON.stringify(
            created,
            null,
            4
        );


    report += "\n\n";


    const id =
        created.id;


    await closeBudget(id);

    report +=
        "CLOSE BUDGET(): PASS\n";


    await lockBudget(id);

    report +=
        "LOCK BUDGET(): PASS\n";


    await unlockBudget(id);

    report +=
        "UNLOCK BUDGET(): PASS\n";


    await reopenBudget(id);

    report +=
        "REOPEN BUDGET(): PASS\n";


}
catch(error) {

    report +=
        "\nTEST FAIL\n\n";

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
