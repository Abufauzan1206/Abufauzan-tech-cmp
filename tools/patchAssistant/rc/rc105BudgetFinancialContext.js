/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC105 - BUDGET FINANCIAL CONTEXT & LIFECYCLE INTEGRITY
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "js/business/budgetEngine.js",
        mode: "regex",
        search: `import \\{\\s*\\n\\s*createBudget,\\s*getBudgetById,\\s*\\n\\s*getAllBudgets,\\s*updateBudget,\\s*deleteBudget\\s*\\n\\} from "\\.\\./services/budgetService\\.js";`,
        replace: `import {
    createBudget,
    getBudgetById,
    getAllBudgets,
    updateBudget,
    deleteBudget
} from "../services/budgetService.js";

import {
    getFinancialYearById
} from "../services/financialYearService.js";`
    },

    {
        path: "js/business/budgetEngine.js",
        mode: "regex",
        search: `export async function createNewBudget\\(data\\) \\{[\\s\\S]*?\\n\\s*const budget = \\{`,
        replace: `export async function createNewBudget(data) {

    if (!data?.name) {
        throw new Error(
            "Budget name is required."
        );
    }

    if (!data?.financialYearId) {
        throw new Error(
            "Financial year is required."
        );
    }

    if (
        typeof data.amount !== "number" ||
        !Number.isFinite(data.amount) ||
        data.amount <= 0
    ) {
        throw new Error(
            "Budget amount must be a positive number."
        );
    }

    const financialYear =
        await getFinancialYearById(
            data.financialYearId
        );

    if (!financialYear) {
        throw new Error(
            "Financial year not found."
        );
    }

    if (
        financialYear.status === "CLOSED" ||
        financialYear.locked === true
    ) {
        throw new Error(
            "Budget cannot be created for a closed or locked financial year."
        );
    }

    const existingBudgets =
        await getAllBudgets();

    const duplicate =
        existingBudgets.find(
            budget =>
                budget.financialYearId ===
                    data.financialYearId &&
                String(budget.name).toLowerCase() ===
                    String(data.name).toLowerCase()
        );

    if (duplicate) {
        throw new Error(
            "Budget already exists for this financial year."
        );
    }

    const budget = {`
    },

    {
        path: "js/business/budgetEngine.js",
        mode: "regex",
        search: `export async function modifyBudget\\(\\s*id,\\s*data\\s*\\) \\{\\s*return await updateBudget\\(\\s*id,\\s*data\\s*\\);\\s*\\}`,
        replace: `export async function modifyBudget(
    id,
    data
) {

    const budget =
        await getBudgetById(id);

    if (!budget) {
        throw new Error(
            "Budget not found."
        );
    }

    if (budget.locked === true) {
        throw new Error(
            "Locked budget cannot be modified."
        );
    }

    if (budget.status === "CLOSED") {
        throw new Error(
            "Closed budget cannot be modified."
        );
    }

    const financialYear =
        await getFinancialYearById(
            budget.financialYearId
        );

    if (!financialYear) {
        throw new Error(
            "Financial year not found."
        );
    }

    if (
        financialYear.status === "CLOSED" ||
        financialYear.locked === true
    ) {
        throw new Error(
            "Budget cannot be modified because the financial year is closed or locked."
        );
    }

    if (
        data?.amount !== undefined &&
        (
            typeof data.amount !== "number" ||
            !Number.isFinite(data.amount) ||
            data.amount <= 0
        )
    ) {
        throw new Error(
            "Budget amount must be a positive number."
        );
    }

    return await updateBudget(
        id,
        data
    );
}`
    },

    {
        path: "js/business/budgetEngine.js",
        mode: "regex",
        search: `export async function removeBudget\\(id\\) \\{\\s*return await deleteBudget\\(\\s*id\\s*\\);\\s*\\}`,
        replace: `export async function removeBudget(id) {

    const budget =
        await getBudgetById(id);

    if (!budget) {
        throw new Error(
            "Budget not found."
        );
    }

    if (budget.locked === true) {
        throw new Error(
            "Locked budget cannot be deleted."
        );
    }

    if (budget.status === "CLOSED") {
        throw new Error(
            "Closed budget cannot be deleted."
        );
    }

    const financialYear =
        await getFinancialYearById(
            budget.financialYearId
        );

    if (!financialYear) {
        throw new Error(
            "Financial year not found."
        );
    }

    if (
        financialYear.status === "CLOSED" ||
        financialYear.locked === true
    ) {
        throw new Error(
            "Budget cannot be deleted because the financial year is closed or locked."
        );
    }

    return await deleteBudget(id);
}`
    }
];

async function run() {

    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC105 - BUDGET FINANCIAL CONTEXT & LIFECYCLE INTEGRITY");
    console.log("=========================================");

    try {

        const result =
            await transaction(patches);

        console.log(
            "RC105 PATCH TRANSACTION RESULT:"
        );

        console.log(
            JSON.stringify(
                result,
                null,
                2
            )
        );

        if (!result.success) {

            process.exitCode = 1;

            console.log(
                "========================================="
            );

            console.log(
                "RC105 PATCH FAIL"
            );

            console.log(
                "========================================="
            );

            return;
        }

        console.log(
            "========================================="
        );

        console.log(
            "RC105 PATCH COMPLETE"
        );

        console.log(
            "========================================="
        );

    } catch (error) {

        console.error(
            "RC105 PATCH ERROR"
        );

        console.error(
            error.message
        );

        process.exitCode = 1;
    }
}

run();
