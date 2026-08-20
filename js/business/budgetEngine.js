/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Business Engine Layer
 *
 * File: budgetEngine.js
 * Version: 1.0.0
 *
 * Budget Management Engine
 * =====================================================
 */

import {
    createBudget,
    getBudgetById,
    getAllBudgets,
    updateBudget,
    deleteBudget
} from "../services/budgetService.js";

import {
    getFinancialYearById
} from "../services/financialYearService.js";



export async function createNewBudget(data) {

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

    const budget = {

        financialYearId:
            data.financialYearId,

        name:
            data.name,

        amount:
            data.amount,

        status:
            "OPEN",

        locked:
            false,

        createdAt:
            new Date().toISOString()

    };


    const result =
        await createBudget(
            budget
        );


    return {

        success: true,

        created: true,

        id:
            result.id ?? result,

        budget

    };

}



export async function findBudgetById(id) {

    return await getBudgetById(
        id
    );

}



export async function findAllBudgets() {

    return await getAllBudgets();

}



export async function modifyBudget(
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

    if (
        data?.financialYearId !== undefined &&
        data.financialYearId !== budget.financialYearId
    ) {
        throw new Error(
            "Budget financial year cannot be changed after creation."
        );
    }
    if (
        data?.financialYearId !== undefined &&
        data.financialYearId !== budget.financialYearId
    ) {
        throw new Error(
            "Budget financial year cannot be changed after creation."
        );
    }

    return await updateBudget(
        id,
        data
    );
}



export async function removeBudget(id) {

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

    if (data?.financialYearId !== undefined &&
        data.financialYearId !== budget.financialYearId
    ) {
        throw new Error(
            "Budget financial year cannot be changed after creation."
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
}
/**
 * =====================================================
 * Budget Lifecycle Management
 * =====================================================
 */


export async function closeBudget(
    id
) {

    const budget =
        await getBudgetById(
            id
        );


    if (!budget) {

        throw new Error(
            "Budget not found."
        );

    }


    await updateBudget(
        id,
        {

            status:
                "CLOSED",

            closedAt:
                new Date().toISOString()

        }
    );


    return {

        success: true,

        closed: true,

        message:
            "Budget closed."

    };

}



export async function lockBudget(
    id
) {

    const budget =
        await getBudgetById(
            id
        );


    if (!budget) {

        throw new Error(
            "Budget not found."
        );

    }


    await updateBudget(
        id,
        {

            locked:
                true,

            lockedAt:
                new Date().toISOString()

        }
    );


    return {

        success: true,

        locked: true,

        message:
            "Budget locked."

    };

}



export async function unlockBudget(
    id
) {

    const budget =
        await getBudgetById(
            id
        );


    if (!budget) {

        throw new Error(
            "Budget not found."
        );

    }


    await updateBudget(
        id,
        {

            locked:
                false,

            unlockedAt:
                new Date().toISOString()

        }
    );


    return {

        success: true,

        unlocked: true,

        message:
            "Budget unlocked."

    };

}



export async function reopenBudget(
    id
) {

    const budget =
        await getBudgetById(
            id
        );


    if (!budget) {

        throw new Error(
            "Budget not found."
        );

    }


    await updateBudget(
        id,
        {

            status:
                "OPEN",

            locked:
                false,

            reopenedAt:
                new Date().toISOString()

        }
    );


    return {

        success: true,

        reopened: true,

        message:
            "Budget reopened."

    };

}
