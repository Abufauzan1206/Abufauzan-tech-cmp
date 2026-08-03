/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Service Layer
 *
 * File: accountingPeriodService.js
 * Version: 1.0.0
 *
 * Accounting Period Business Service
 * =====================================================
 */

import {
    CMPRepositoryManager
} from "../repositories/repositoryManager.js";

const accountingPeriodRepository =
    CMPRepositoryManager.get("accountingPeriod");

export async function createAccountingPeriod(data) {
    return await accountingPeriodRepository.create(data);
}

export async function getAccountingPeriodById(id) {
    return await accountingPeriodRepository.findById(id);
}

export async function getAllAccountingPeriods() {
    return await accountingPeriodRepository.findAll();
}

export async function updateAccountingPeriod(id, data) {
    return await accountingPeriodRepository.update(id, data);
}

export async function deleteAccountingPeriod(id) {
    return await accountingPeriodRepository.delete(id);
}
/**
 * Get currently open accounting period
 */
export async function getOpenAccountingPeriod() {

    const periods =
        await getAllAccountingPeriods();

    return periods.find(
        period =>
            period.status === "OPEN" &&
            period.locked !== true
    ) ?? null;

}
/**
 * Get accounting period containing a specific date
 */
export async function getAccountingPeriodByDate(date) {

    const periods =
        await getAllAccountingPeriods();

    const targetDate =
        new Date(date);

    return periods.find(period => {

        const start =
            new Date(period.startDate);

        const end =
            new Date(period.endDate);

        return (
            targetDate >= start &&
            targetDate <= end
        );

    }) ?? null;

}
