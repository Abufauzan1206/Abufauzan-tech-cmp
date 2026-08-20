/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC109 - BUDGET LIFECYCLE PROTECTION TEST
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "testBudgetLifecycleEngine.js",
        mode: "regex",
        search: `import \\{\\s*createNewBudget,\\s*closeBudget,\\s*lockBudget,\\s*unlockBudget,\\s*reopenBudget\\s*\\} from "\\./js/business/budgetEngine\\.js";`,
        replace: `import {
    createNewBudget,
    closeBudget,
    lockBudget,
    unlockBudget,
    reopenBudget,
    modifyBudget,
    removeBudget
} from "./js/business/budgetEngine.js";`
    },

    {
        path: "testBudgetLifecycleEngine.js",
        mode: "regex",
        search: `await expectFailure\\(\\s*"LOCKED FINANCIAL YEAR CREATION REJECTION"[\\s\\S]*?\\);`,
        replace: `await expectFailure(
        "LOCKED FINANCIAL YEAR CREATION REJECTION",
        () => createNewBudget({
            financialYearId: lockedYear.id,
            name: "Locked Year Budget",
            amount: 100000
        })
    );

    // -------------------------------------------------
    // RC109 - Budget Lifecycle Protection Verification
    // -------------------------------------------------

    const closedBudgetYear = await createYear({
        name: "FY 2034 Closed Budget Protection Year",
        startDate: "2034-01-01",
        endDate: "2034-12-31"
    });

    const closedBudget = await createNewBudget({
        financialYearId: closedBudgetYear.id,
        name: "Closed Budget Protection Test",
        amount: 200000
    });

    await closeBudget(closedBudget.id);

    await expectFailure(
        "CLOSED BUDGET MODIFICATION REJECTION",
        () => modifyBudget(
            closedBudget.id,
            { amount: 250000 }
        )
    );

    await expectFailure(
        "CLOSED BUDGET DELETION REJECTION",
        () => removeBudget(closedBudget.id)
    );

    const lockedBudgetYear = await createYear({
        name: "FY 2035 Locked Budget Protection Year",
        startDate: "2035-01-01",
        endDate: "2035-12-31"
    });

    const lockedBudget = await createNewBudget({
        financialYearId: lockedBudgetYear.id,
        name: "Locked Budget Protection Test",
        amount: 300000
    });

    await lockBudget(lockedBudget.id);

    await expectFailure(
        "LOCKED BUDGET MODIFICATION REJECTION",
        () => modifyBudget(
            lockedBudget.id,
            { amount: 350000 }
        )
    );

    await expectFailure(
        "LOCKED BUDGET DELETION REJECTION",
        () => removeBudget(lockedBudget.id)
    );

    const closedFinancialYear = await createYear({
        name: "FY 2036 Closed Financial Context Year",
        startDate: "2036-01-01",
        endDate: "2036-12-31"
    });

    const budgetInClosedYear = await createNewBudget({
        financialYearId: closedFinancialYear.id,
        name: "Budget In Closed Financial Year",
        amount: 400000
    });

    await closeYear(closedFinancialYear.id);

    await expectFailure(
        "CLOSED FINANCIAL YEAR BUDGET MODIFICATION REJECTION",
        () => modifyBudget(
            budgetInClosedYear.id,
            { amount: 450000 }
        )
    );

    await expectFailure(
        "CLOSED FINANCIAL YEAR BUDGET DELETION REJECTION",
        () => removeBudget(budgetInClosedYear.id)
    );

    const lockedFinancialYear = await createYear({
        name: "FY 2037 Locked Financial Context Year",
        startDate: "2037-01-01",
        endDate: "2037-12-31"
    });

    const budgetInLockedYear = await createNewBudget({
        financialYearId: lockedFinancialYear.id,
        name: "Budget In Locked Financial Year",
        amount: 500000
    });

    await lockYear(lockedFinancialYear.id);

    await expectFailure(
        "LOCKED FINANCIAL YEAR BUDGET MODIFICATION REJECTION",
        () => modifyBudget(
            budgetInLockedYear.id,
            { amount: 550000 }
        )
    );

    await expectFailure(
        "LOCKED FINANCIAL YEAR BUDGET DELETION REJECTION",
        () => removeBudget(budgetInLockedYear.id)
    );`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC109 - BUDGET LIFECYCLE PROTECTION TEST");
    console.log("=========================================");

    try {
        const result = await transaction(patches);

        console.log("RC109 PATCH TRANSACTION RESULT:");
        console.log(JSON.stringify(result, null, 2));

        if (!result.success) {
            process.exitCode = 1;
            console.log("=========================================");
            console.log("RC109 PATCH FAIL");
            console.log("=========================================");
            return;
        }

        console.log("=========================================");
        console.log("RC109 PATCH COMPLETE");
        console.log("=========================================");

    } catch (error) {
        console.error("RC109 PATCH ERROR");
        console.error(error.message);
        process.exitCode = 1;
    }
}

run();
