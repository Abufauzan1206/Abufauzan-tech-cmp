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
    findBudgetById,
    closeBudget,
    lockBudget,
    unlockBudget,
    reopenBudget,
    modifyBudget,
    removeBudget
} from "./js/business/budgetEngine.js";

import {
    createYear,
    closeYear,
    lockYear
} from "./js/business/financialYearEngine.js";


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


    const financialYear = await createYear({
        name: "FY 2030 Budget Lifecycle Test Year",
        startDate: "2030-01-01",
        endDate: "2030-12-31"
    });

    const created = await createNewBudget({
        financialYearId: financialYear.id,
        name: "FY 2030 Operating Budget",
        amount: 500000
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
        "REOPEN BUDGET(): PASS\\n";

    // -------------------------------------------------
    // RC107 - Financial Context & Integrity Verification
    // -------------------------------------------------

    const expectFailure = async (label, operation) => {
        try {
            await operation();
            report += label + ": FAIL (operation unexpectedly succeeded)\\n";
        } catch (error) {
            report += label + ": PASS\\n";
        }
    };

    await expectFailure(
        "NONEXISTENT FINANCIAL YEAR REJECTION",
        () => createNewBudget({
            financialYearId: "nonexistent-financial-year",
            name: "Invalid Financial Year Budget",
            amount: 100000
        })
    );

    await expectFailure(
        "INVALID ZERO AMOUNT REJECTION",
        () => createNewBudget({
            financialYearId: financialYear.id,
            name: "Zero Amount Budget",
            amount: 0
        })
    );

    await expectFailure(
        "INVALID NEGATIVE AMOUNT REJECTION",
        () => createNewBudget({
            financialYearId: financialYear.id,
            name: "Negative Amount Budget",
            amount: -1000
        })
    );

    const duplicateYear = await createYear({
        name: "FY 2031 Budget Integrity Test Year",
        startDate: "2031-01-01",
        endDate: "2031-12-31"
    });

    await createNewBudget({
        financialYearId: duplicateYear.id,
        name: "Duplicate Test Budget",
        amount: 100000
    });

    await expectFailure(
        "DUPLICATE BUDGET REJECTION",
        () => createNewBudget({
            financialYearId: duplicateYear.id,
            name: "Duplicate Test Budget",
            amount: 100000
        })
    );

    const closedYear = await createYear({
        name: "FY 2032 Closed Budget Test Year",
        startDate: "2032-01-01",
        endDate: "2032-12-31"
    });

    await closeYear(closedYear.id);

    await expectFailure(
        "CLOSED FINANCIAL YEAR CREATION REJECTION",
        () => createNewBudget({
            financialYearId: closedYear.id,
            name: "Closed Year Budget",
            amount: 100000
        })
    );

    const lockedYear = await createYear({
        name: "FY 2033 Locked Budget Test Year",
        startDate: "2033-01-01",
        endDate: "2033-12-31"
    });

    await lockYear(lockedYear.id);

    await expectFailure(
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
            ? "INITIAL OPEN STATE: PASS\\n"
            : "INITIAL OPEN STATE: FAIL\\n";

    await closeBudget(transitionBudget.id);

    currentBudget = await findBudgetById(transitionBudget.id);

    report +=
        currentBudget.status === "CLOSED"
            ? "OPEN TO CLOSED STATE: PASS\\n"
            : "OPEN TO CLOSED STATE: FAIL\\n";

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
            ? "CLOSED TO OPEN REOPEN STATE: PASS\\n"
            : "CLOSED TO OPEN REOPEN STATE: FAIL\\n";

    await lockBudget(transitionBudget.id);

    currentBudget = await findBudgetById(transitionBudget.id);

    report +=
        currentBudget.locked === true
            ? "OPEN TO LOCKED STATE: PASS\\n"
            : "OPEN TO LOCKED STATE: FAIL\\n";

    await unlockBudget(transitionBudget.id);

    currentBudget = await findBudgetById(transitionBudget.id);

    report +=
        currentBudget.locked === false
            ? "LOCKED TO UNLOCKED STATE: PASS\\n"
            : "LOCKED TO UNLOCKED STATE: FAIL\\n";

    await closeBudget(transitionBudget.id);
    await lockBudget(transitionBudget.id);

    currentBudget = await findBudgetById(transitionBudget.id);

    report +=
        currentBudget.status === "CLOSED" &&
        currentBudget.locked === true
            ? "CLOSED AND LOCKED COMBINED STATE: PASS\\n"
            : "CLOSED AND LOCKED COMBINED STATE: FAIL\\n";

    await reopenBudget(transitionBudget.id);

    currentBudget = await findBudgetById(transitionBudget.id);

    report +=
        currentBudget.status === "OPEN" &&
        currentBudget.locked === false
            ? "REOPEN CLEARS LOCK STATE: PASS\\n"
            : "REOPEN CLEARS LOCK STATE: FAIL\\n";

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
    );
    // -------------------------------------------------
    // RC112 - Budget / Financial Year Association
    // -------------------------------------------------

    const associationYearA = await createYear({
        name: "FY 2040 Budget Association Year A",
        startDate: "2040-01-01",
        endDate: "2040-12-31"
    });

    const associationYearB = await createYear({
        name: "FY 2041 Budget Association Year B",
        startDate: "2041-01-01",
        endDate: "2041-12-31"
    });

    const associationBudget = await createNewBudget({
        financialYearId: associationYearA.id,
        name: "Financial Year Association Test Budget",
        amount: 600000
    });

    const originalAssociationBudget =
        await findBudgetById(associationBudget.id);

    if (
        originalAssociationBudget.financialYearId ===
        associationYearA.id
    ) {
        report +=
            "INITIAL FINANCIAL YEAR ASSOCIATION: PASS\\n";
    } else {
        report +=
            "INITIAL FINANCIAL YEAR ASSOCIATION: FAIL\\n";
    }

    await modifyBudget(
        associationBudget.id,
        {
            amount: 650000
        }
    );

    const modifiedAssociationBudget =
        await findBudgetById(associationBudget.id);

    if (
        modifiedAssociationBudget.financialYearId ===
            associationYearA.id &&
        modifiedAssociationBudget.amount === 650000
    ) {
        report +=
            "VALID SAME-YEAR BUDGET MODIFICATION: PASS\\n";
    } else {
        report +=
            "VALID SAME-YEAR BUDGET MODIFICATION: FAIL\\n";
    }

    await expectFailure(
        "FINANCIAL YEAR REASSIGNMENT REJECTION",
        () => modifyBudget(
            associationBudget.id,
            {
                financialYearId: associationYearB.id
            }
        )
    );

    const finalAssociationBudget =
        await findBudgetById(associationBudget.id);

    if (
        finalAssociationBudget.financialYearId ===
        associationYearA.id
    ) {
        report +=
            "FINANCIAL YEAR ASSOCIATION PRESERVED: PASS\\n";
    } else {
        report +=
            "FINANCIAL YEAR ASSOCIATION PRESERVED: FAIL\\n";
    }


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
    "=========================================\n";


console.log(report);
