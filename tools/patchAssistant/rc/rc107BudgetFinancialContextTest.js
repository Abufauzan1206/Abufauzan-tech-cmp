/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC107 - BUDGET FINANCIAL CONTEXT & INTEGRITY TEST
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "testBudgetLifecycleEngine.js",
        mode: "regex",
        search: `report \\+=\\s*"REOPEN BUDGET\\(\\): PASS\\\\n";`,
        replace: `report +=
        "REOPEN BUDGET(): PASS\\\\n";

    // -------------------------------------------------
    // RC107 - Financial Context & Integrity Verification
    // -------------------------------------------------

    const expectFailure = async (label, operation) => {
        try {
            await operation();
            report += label + ": FAIL (operation unexpectedly succeeded)\\\\n";
        } catch (error) {
            report += label + ": PASS\\\\n";
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
    );`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC107 - BUDGET FINANCIAL CONTEXT & INTEGRITY TEST");
    console.log("=========================================");

    try {
        const result = await transaction(patches);

        console.log("RC107 PATCH TRANSACTION RESULT:");
        console.log(JSON.stringify(result, null, 2));

        if (!result.success) {
            process.exitCode = 1;
            console.log("=========================================");
            console.log("RC107 PATCH FAIL");
            console.log("=========================================");
            return;
        }

        console.log("=========================================");
        console.log("RC107 PATCH COMPLETE");
        console.log("=========================================");

    } catch (error) {
        console.error("RC107 PATCH ERROR");
        console.error(error.message);
        process.exitCode = 1;
    }
}

run();
