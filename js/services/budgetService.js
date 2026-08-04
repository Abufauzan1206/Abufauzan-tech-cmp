/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Service Layer
 *
 * File: budgetService.js
 * Version: 1.0.0
 *
 * Budget Business Service
 * =====================================================
 */

import {
    CMPRepositoryManager
} from "../repositories/repositoryManager.js";


const budgetRepository =
    CMPRepositoryManager.get(
        "budget"
    );


export async function createBudget(data) {

    return await budgetRepository.create(
        data
    );

}


export async function getBudgetById(id) {

    return await budgetRepository.findById(
        id
    );

}


export async function getAllBudgets() {

    return await budgetRepository.findAll();

}


export async function updateBudget(
    id,
    data
) {

    return await budgetRepository.update(
        id,
        data
    );

}


export async function deleteBudget(id) {

    return await budgetRepository.delete(
        id
    );

}
