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


    if (!data?.amount) {

        throw new Error(
            "Budget amount is required."
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

    return await updateBudget(
        id,
        data
    );

}



export async function removeBudget(id) {

    return await deleteBudget(
        id
    );

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
