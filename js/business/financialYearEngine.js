/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Business Engine Layer
 *
 * File: financialYearEngine.js
 * Version: 2.0.0
 *
 * Financial Year Lifecycle Engine
 * =====================================================
 */

import {
    createFinancialYear,
    getAllFinancialYears,
    updateFinancialYear,
    getFinancialYearById
} from "../services/financialYearService.js";



export async function createYear(data) {

    if (!data?.name) {

        throw new Error(
            "Financial year name is required."
        );

    }


    if (
        !data?.startDate ||
        !data?.endDate
    ) {

        throw new Error(
            "Start date and end date are required."
        );

    }


    if (
        new Date(data.startDate) >=
        new Date(data.endDate)
    ) {

        throw new Error(
            "Start date must be before end date."
        );

    }


    const years =
        await getAllFinancialYears();


    const exists =
        years.find(
            year =>
                year.name.toLowerCase() ===
                data.name.toLowerCase()
        );


    if (exists) {

        throw new Error(
            "Financial year already exists."
        );

    }


    const year = {

        name:
            data.name,

        startDate:
            data.startDate,

        endDate:
            data.endDate,

        status:
            data.status || "OPEN",

        locked:
            false,

        createdAt:
            new Date().toISOString()

    };


    const result =
        await createFinancialYear(
            year
        );


    return {

        success: true,

        created: true,

        id:
            result.id ?? result,

        year

    };

}



/**
 * Close Financial Year
 */
export async function closeYear(
    id
) {

    const year =
        await getFinancialYearById(id);


    if (!year) {

        throw new Error(
            "Financial year not found."
        );

    }


    await updateFinancialYear(
        id,
        {
            status:
                "CLOSED"
        }
    );


    return {

        success: true,

        closed: true,

        message:
            "Financial year closed successfully."

    };

}



/**
 * Lock Financial Year
 */
export async function lockYear(
    id
) {

    const year =
        await getFinancialYearById(id);


    if (!year) {

        throw new Error(
            "Financial year not found."
        );

    }


    await updateFinancialYear(
        id,
        {
            locked:
                true,

            status:
                "CLOSED"
        }
    );


    return {

        success: true,

        locked: true,

        message:
            "Financial year locked successfully."

    };

}



/**
 * Unlock Financial Year
 */
export async function unlockYear(
    id
) {

    const year =
        await getFinancialYearById(id);


    if (!year) {

        throw new Error(
            "Financial year not found."
        );

    }


    await updateFinancialYear(
        id,
        {
            locked:
                false
        }
    );


    return {

        success: true,

        unlocked: true,

        message:
            "Financial year unlocked."

    };

}



/**
 * Reopen Financial Year
 */
export async function reopenYear(
    id
) {

    const year =
        await getFinancialYearById(id);


    if (!year) {

        throw new Error(
            "Financial year not found."
        );

    }


    await updateFinancialYear(
        id,
        {
            status:
                "OPEN",

            locked:
                false
        }
    );


    return {

        success: true,

        reopened: true,

        message:
            "Financial year reopened."

    };

}
