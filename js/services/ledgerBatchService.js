/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Service Layer
 *
 * File: ledgerBatchService.js
 * Version: 1.0.0
 *
 * Ledger Batch Business Service
 * =====================================================
 */

import { CMPRepositoryManager }
from "../repositories/repositoryManager.js";

const ledgerBatchRepository =
    CMPRepositoryManager.get("ledgerBatch");

export async function createLedgerBatch(data) {
    return await ledgerBatchRepository.create(data);
}

export async function getLedgerBatchById(id) {
    return await ledgerBatchRepository.findById(id);
}

export async function getAllLedgerBatches() {
    return await ledgerBatchRepository.findAll();
}

export async function updateLedgerBatch(id, data) {
    return await ledgerBatchRepository.update(id, data);
}

export async function deleteLedgerBatch(id) {
    return await ledgerBatchRepository.delete(id);
}
