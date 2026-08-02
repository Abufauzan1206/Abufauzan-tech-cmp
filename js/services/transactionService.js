/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Service Layer
 *
 * File: transactionService.js
 * Version: 1.0.0
 *
 * Transaction Business Service
 * =====================================================
 */

import { CMPRepositoryManager }
from "../repositories/repositoryManager.js";

const transactionRepository =
    CMPRepositoryManager.get("transaction");


export async function createTransaction(data) {

    return await transactionRepository.create(data);

}


export async function getTransactionById(id) {

    return await transactionRepository.findById(id);

}


export async function getAllTransactions() {

    return await transactionRepository.findAll();

}


export async function updateTransaction(id, data) {

    return await transactionRepository.update(id, data);

}


export async function deleteTransaction(id) {

    return await transactionRepository.delete(id);

}
