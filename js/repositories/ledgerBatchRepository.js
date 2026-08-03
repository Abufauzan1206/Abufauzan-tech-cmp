/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Repository Module
 *
 * File: ledgerBatchRepository.js
 * Version: 1.0.0
 *
 * Adapter Based Ledger Batch Repository
 * =====================================================
 */

import { CMPBaseRepository } from "./baseRepository.js";
import { CMPAdapterFactory } from "../adapters/adapterFactory.js";

export class CMPLedgerBatchRepository
    extends CMPBaseRepository {

    constructor() {

        super(
            CMPAdapterFactory.firebase("ledgerBatches")
        );

    }

}
