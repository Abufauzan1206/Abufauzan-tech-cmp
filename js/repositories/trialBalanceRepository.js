/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Repository Module
 *
 * File: trialBalanceRepository.js
 * Version: 1.0.0
 *
 * Trial Balance Repository
 * =====================================================
 */

import { CMPBaseRepository } from "./baseRepository.js";
import { CMPAdapterFactory } from "../adapters/adapterFactory.js";

export class CMPTrialBalanceRepository extends CMPBaseRepository {

    constructor() {
        super(
            CMPAdapterFactory.firebase("ledgerBatches")
        );
    }

}
