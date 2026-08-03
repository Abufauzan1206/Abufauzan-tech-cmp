/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Service Layer
 *
 * File: trialBalanceService.js
 * Version: 1.0.0
 *
 * Trial Balance Business Service
 * =====================================================
 */

import {
    CMPRepositoryManager
} from "../repositories/repositoryManager.js";


const trialBalanceRepository =
    CMPRepositoryManager.get("trialBalance");


export async function getAllLedgerBatches() {

    return await trialBalanceRepository.findAll();

}
