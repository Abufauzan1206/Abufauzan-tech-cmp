/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Service Layer
 *
 * File: chartOfAccountsService.js
 * Version: 2.0.0
 *
 * Chart of Accounts Business Service
 * =====================================================
 */

import {
    CMPRepositoryManager
} from "../repositories/repositoryManager.js";

const chartOfAccountsRepository =
    CMPRepositoryManager.get("chartOfAccounts");

export async function createAccount(data) {
    return await chartOfAccountsRepository.create(data);
}

export async function getAccountById(id) {
    return await chartOfAccountsRepository.findById(id);
}

export async function getAllAccounts() {
    return await chartOfAccountsRepository.findAll();
}

export async function getAccountByName(name) {

    const accounts =
        await getAllAccounts();

    return accounts.find(
        account => account.name === name
    ) ?? null;

}

export async function updateAccount(id, data) {
    return await chartOfAccountsRepository.update(id, data);
}

export async function deleteAccount(id) {
    return await chartOfAccountsRepository.delete(id);
}
