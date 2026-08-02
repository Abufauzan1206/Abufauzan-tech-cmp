/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Service Layer
 *
 * File: ledgerService.js
 * Version: 1.0.0
 *
 * Ledger Business Service
 * =====================================================
 */

import { CMPRepositoryManager }
from "../repositories/repositoryManager.js";


const ledgerRepository =
    CMPRepositoryManager.get("ledger");



export async function createLedger(data) {

    return await ledgerRepository.create(data);

}



export async function getLedgerById(id) {

    return await ledgerRepository.findById(id);

}



export async function getAllLedgers() {

    return await ledgerRepository.findAll();

}



export async function updateLedger(id, data) {

    return await ledgerRepository.update(id, data);

}



export async function deleteLedger(id) {

    return await ledgerRepository.delete(id);

}
