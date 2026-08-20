/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC112 - BUDGET FINANCIAL-YEAR ASSOCIATION INTEGRITY
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "js/business/budgetEngine.js",
        mode: "regex",
        search: `if \\(budget\\.status === "CLOSED"\\) \\{\\s*throw new Error\\(\\s*"Closed budget cannot be modified\\."\\s*\\);\\s*\\}`,
        replace: `if (budget.status === "CLOSED") {
        throw new Error(
            "Closed budget cannot be modified."
        );
    }

    if (
        data?.financialYearId !== undefined &&
        data.financialYearId !== budget.financialYearId
    ) {
        throw new Error(
            "Budget financial year cannot be changed."
        );
    }`
    },

    {
        path: "testBudgetLifecycleEngine.js",
        mode: "regex",
        search: `console\\.log\\("========================================="\\);\\s*console\\.log\\("TEST COMPLETE"\\);`,
        replace: `    // -------------------------------------------------
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
        report += "INITIAL FINANCIAL YEAR ASSOCIATION: PASS\\\\n";
    } else {
        report += "INITIAL FINANCIAL YEAR ASSOCIATION: FAIL\\\\n";
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
        report += "VALID SAME-YEAR BUDGET MODIFICATION: PASS\\\\n";
    } else {
        report += "VALID SAME-YEAR BUDGET MODIFICATION: FAIL\\\\n";
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
        report += "FINANCIAL YEAR ASSOCIATION PRESERVED: PASS\\\\n";
    } else {
        report += "FINANCIAL YEAR ASSOCIATION PRESERVED: FAIL\\\\n";
    }

    console.log("=========================================");
    console.log("TEST COMPLETE");`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC112 - BUDGET FINANCIAL-YEAR ASSOCIATION INTEGRITY");
    console.log("=========================================");

    try {
        const result = await transaction(patches);

        console.log("RC112 PATCH TRANSACTION RESULT:");
        console.log(JSON.stringify(result, null, 2));

        if (!result.success) {
            process.exitCode = 1;
            console.log("=========================================");
            console.log("RC112 PATCH FAIL");
            console.log("=========================================");
            return;
        }

        console.log("=========================================");
        console.log("RC112 PATCH COMPLETE");
        console.log("=========================================");

    } catch (error) {
        console.error("RC112 PATCH ERROR");
        console.error(error.message);
        process.exitCode = 1;
    }
}

run();
