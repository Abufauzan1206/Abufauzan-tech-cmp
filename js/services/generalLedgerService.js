/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Service Layer
 *
 * File: generalLedgerService.js
 * Version: 1.0.0
 *
 * General Ledger Business Service
 * =====================================================
 */

import {
    CMPRepositoryManager
} from "../repositories/repositoryManager.js";

const generalLedgerRepository =
    CMPRepositoryManager.get("generalLedger");

export async function getAllLedgerBatches() {

    return await generalLedgerRepository.findAll();

}
