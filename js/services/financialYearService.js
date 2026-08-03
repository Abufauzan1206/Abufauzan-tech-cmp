/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Service Layer
 *
 * File: financialYearService.js
 * Version: 1.0.0
 *
 * Financial Year Business Service
 * =====================================================
 */

import {
    CMPRepositoryManager
} from "../repositories/repositoryManager.js";


const financialYearRepository =
    CMPRepositoryManager.get(
        "financialYear"
    );



export async function createFinancialYear(data) {

    return await financialYearRepository.create(
        data
    );

}



export async function getFinancialYearById(id) {

    return await financialYearRepository.findById(
        id
    );

}



export async function getAllFinancialYears() {

    return await financialYearRepository.findAll();

}



export async function updateFinancialYear(
    id,
    data
) {

    return await financialYearRepository.update(
        id,
        data
    );

}



export async function deleteFinancialYear(id) {

    return await financialYearRepository.delete(
        id
    );

}
