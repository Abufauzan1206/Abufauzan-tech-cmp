/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC112.3 - FIX BUDGET ASSOCIATION SCOPE
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const associationBlock = `// -------------------------------------------------
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
        "INITIAL FINANCIAL YEAR ASSOCIATION: PASS\\\\n";
} else {
    report +=
        "INITIAL FINANCIAL YEAR ASSOCIATION: FAIL\\\\n";
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
        "VALID SAME-YEAR BUDGET MODIFICATION: PASS\\\\n";
} else {
    report +=
        "VALID SAME-YEAR BUDGET MODIFICATION: FAIL\\\\n";
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
        "FINANCIAL YEAR ASSOCIATION PRESERVED: PASS\\\\n";
} else {
    report +=
        "FINANCIAL YEAR ASSOCIATION PRESERVED: FAIL\\\\n";
}

`;

const patches = [
    {
        path: "testBudgetLifecycleEngine.js",
        mode: "regex",
        search: `// RC112 - Budget / Financial Year Association[\\\\s\\\\S]*?report \\+=\\s*"TEST COMPLETE\\\\\\\\n";`,
        replace: ""
    },
    {
        path: "testBudgetLifecycleEngine.js",
        mode: "regex",
        search: `\\}\\s*catch\\(error\\)\\s*\\{`,
        replace: `${associationBlock}
} catch(error) {`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC112.3 - FIX BUDGET ASSOCIATION SCOPE");
    console.log("=========================================");

    try {
        const result = await transaction(patches);

        console.log("RC112.3 PATCH TRANSACTION RESULT:");
        console.log(JSON.stringify(result, null, 2));

        if (!result.success) {
            process.exitCode = 1;
            console.log("=========================================");
            console.log("RC112.3 PATCH FAIL");
            console.log("=========================================");
            return;
        }

        console.log("=========================================");
        console.log("RC112.3 PATCH COMPLETE");
        console.log("=========================================");

    } catch (error) {
        console.error("RC112.3 PATCH ERROR");
        console.error(error.message);
        process.exitCode = 1;
    }
}

run();
