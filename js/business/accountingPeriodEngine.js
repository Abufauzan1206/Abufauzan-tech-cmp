/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Business Engine Layer
 *
 * File: accountingPeriodEngine.js
 * Version: 2.0.0
 *
 * Accounting Period Lifecycle Engine
 * =====================================================
 */

import {
    createAccountingPeriod,
    getAllAccountingPeriods,
    updateAccountingPeriod,
    getAccountingPeriodById
} from "../services/accountingPeriodService.js";

import {
    getFinancialYearById
} from "../services/financialYearService.js";


export async function createPeriod(data) {
    if (!data?.name) {
        throw new Error(
            "Accounting period name is required."
        );
    }

    if (!data?.startDate || !data?.endDate) {
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

    if (!data?.financialYearId) {
        throw new Error(
            "Financial year is required."
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
        new Date(data.startDate) <
        new Date(financialYear.startDate) ||
        new Date(data.endDate) >
        new Date(financialYear.endDate)
    ) {
        throw new Error(
            "Accounting period must fall within the financial year."
        );
    }

    const periods =
        await getAllAccountingPeriods();

    const exists = periods.find(
        period =>
            period.name.toLowerCase() ===
            data.name.toLowerCase()
    );

    if (exists) {
        throw new Error(
            "Accounting period already exists."
        );
    }

    const period = {

        name: data.name,
        financialYearId:
            data.financialYearId,
        startDate: data.startDate,
        endDate: data.endDate,

        status: "OPEN",
        locked: false,

        createdAt:
            new Date().toISOString()

    };

    const result =
        await createAccountingPeriod(period);

    return {
        success: true,
        created: true,
        id: result.id ?? result,
        period
    };

}



export async function closePeriod(
    id,
    closedBy = "CMP"
) {

    const period =
        await getAccountingPeriodById(id);

    if (!period) {
        throw new Error(
            "Accounting period not found."
        );
    }

    if (period.locked) {
        throw new Error(
            "Locked period cannot be closed."
        );
    }

    await updateAccountingPeriod(id, {

        status: "CLOSED",

        closedAt:
            new Date().toISOString(),

        closedBy

    });

    return {

        success: true,

        closed: true,

        message:
            "Accounting period closed successfully."

    };

}



export async function lockPeriod(
    id,
    lockedBy = "CMP",
    reason = "Period lock"
) {

    const period =
        await getAccountingPeriodById(id);

    if (!period) {
        throw new Error(
            "Accounting period not found."
        );
    }

    if (period.locked) {
        throw new Error(
            "Accounting period already locked."
        );
    }

    await updateAccountingPeriod(id, {

        status: "LOCKED",
        locked: true,

        lockedAt:
            new Date().toISOString(),

        lockedBy,

        lockReason: reason

    });

    return {
        success: true,
        locked: true,
        status: "LOCKED",
        periodId: id,
        message:
            "Accounting period locked successfully."
    };

}



export async function unlockPeriod(
    id
) {

    const period =
        await getAccountingPeriodById(id);

    if (!period) {
        throw new Error(
            "Accounting period not found."
        );
    }

    await updateAccountingPeriod(id, {

        status: "OPEN",
        locked: false,

        unlockedAt:
            new Date().toISOString()

    });

    return {

        success: true,

        unlocked: true,

        message:
            "Accounting period unlocked."

    };

}



export async function reopenPeriod(
    id,
    reopenedBy = "CMP"
) {

    const period =
        await getAccountingPeriodById(id);

    if (!period) {
        throw new Error(
            "Accounting period not found."
        );
    }

    await updateAccountingPeriod(id, {

        status: "OPEN",
        locked: false,

        reopenedAt:
            new Date().toISOString(),

        reopenedBy

    });

    return {

        success: true,

        reopened: true,

        message:
            "Accounting period reopened."

    };

}
