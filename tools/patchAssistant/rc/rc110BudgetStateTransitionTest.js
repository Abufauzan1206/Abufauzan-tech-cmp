/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC110 - BUDGET STATE TRANSITION INTEGRITY TEST
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "testBudgetLifecycleEngine.js",
        mode: "regex",
        search: `await expectFailure\\(\\s*"LOCKED FINANCIAL YEAR BUDGET DELETION REJECTION"[\\s\\S]*?\\);`,
        replace: `await expectFailure(
        "LOCKED FINANCIAL YEAR BUDGET DELETION REJECTION",
        () => removeBudget(budgetInLockedYear.id)
    );

    // -------------------------------------------------
    // RC110 - State Transition Integrity Verification
    // -------------------------------------------------

    const transitionYear = await createYear({
        name: "FY 2038 Budget State Transition Test Year",
        startDate: "2038-01-01",
        endDate: "2038-12-31"
    });

    const transitionBudget = await createNewBudget({
        financialYearId: transitionYear.id,
        name: "Budget State Transition Test",
        amount: 600000
    });

    let currentBudget = await findBudgetById(transitionBudget.id);

    report +=
        currentBudget.status === "OPEN" &&
        currentBudget.locked === false
            ? "INITIAL OPEN STATE: PASS\\\\n"
            : "INITIAL OPEN STATE: FAIL\\\\n";

    await closeBudget(transitionBudget.id);

    currentBudget = await findBudgetById(transitionBudget.id);

    report +=
        currentBudget.status === "CLOSED"
            ? "OPEN TO CLOSED STATE: PASS\\\\n"
            : "OPEN TO CLOSED STATE: FAIL\\\\n";

    await expectFailure(
        "CLOSED BUDGET DIRECT MODIFICATION REJECTION",
        () => modifyBudget(
            transitionBudget.id,
            { status: "OPEN" }
        )
    );

    await reopenBudget(transitionBudget.id);

    currentBudget = await findBudgetById(transitionBudget.id);

    report +=
        currentBudget.status === "OPEN" &&
        currentBudget.locked === false
            ? "CLOSED TO OPEN REOPEN STATE: PASS\\\\n"
            : "CLOSED TO OPEN REOPEN STATE: FAIL\\\\n";

    await lockBudget(transitionBudget.id);

    currentBudget = await findBudgetById(transitionBudget.id);

    report +=
        currentBudget.locked === true
            ? "OPEN TO LOCKED STATE: PASS\\\\n"
            : "OPEN TO LOCKED STATE: FAIL\\\\n";

    await unlockBudget(transitionBudget.id);

    currentBudget = await findBudgetById(transitionBudget.id);

    report +=
        currentBudget.locked === false
            ? "LOCKED TO UNLOCKED STATE: PASS\\\\n"
            : "LOCKED TO UNLOCKED STATE: FAIL\\\\n";

    await closeBudget(transitionBudget.id);
    await lockBudget(transitionBudget.id);

    currentBudget = await findBudgetById(transitionBudget.id);

    report +=
        currentBudget.status === "CLOSED" &&
        currentBudget.locked === true
            ? "CLOSED AND LOCKED COMBINED STATE: PASS\\\\n"
            : "CLOSED AND LOCKED COMBINED STATE: FAIL\\\\n";

    await reopenBudget(transitionBudget.id);

    currentBudget = await findBudgetById(transitionBudget.id);

    report +=
        currentBudget.status === "OPEN" &&
        currentBudget.locked === false
            ? "REOPEN CLEARS LOCK STATE: PASS\\\\n"
            : "REOPEN CLEARS LOCK STATE: FAIL\\\\n";

    await expectFailure(
        "NONEXISTENT BUDGET CLOSE REJECTION",
        () => closeBudget("nonexistent-budget-id")
    );

    await expectFailure(
        "NONEXISTENT BUDGET LOCK REJECTION",
        () => lockBudget("nonexistent-budget-id")
    );

    await expectFailure(
        "NONEXISTENT BUDGET UNLOCK REJECTION",
        () => unlockBudget("nonexistent-budget-id")
    );

    await expectFailure(
        "NONEXISTENT BUDGET REOPEN REJECTION",
        () => reopenBudget("nonexistent-budget-id")
    );`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC110 - BUDGET STATE TRANSITION INTEGRITY TEST");
    console.log("=========================================");

    try {
        const result = await transaction(patches);

        console.log("RC110 PATCH TRANSACTION RESULT:");
        console.log(JSON.stringify(result, null, 2));

        if (!result.success) {
            process.exitCode = 1;
            console.log("=========================================");
            console.log("RC110 PATCH FAIL");
            console.log("=========================================");
            return;
        }

        console.log("=========================================");
        console.log("RC110 PATCH COMPLETE");
        console.log("=========================================");

    } catch (error) {
        console.error("RC110 PATCH ERROR");
        console.error(error.message);
        process.exitCode = 1;
    }
}

run();
