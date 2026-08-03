/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Repository Module
 *
 * File: generalLedgerRepository.js
 * Version: 1.0.0
 *
 * General Ledger Repository
 * =====================================================
 */

import { CMPBaseRepository } from "./baseRepository.js";
import { CMPAdapterFactory } from "../adapters/adapterFactory.js";

export class CMPGeneralLedgerRepository extends CMPBaseRepository {

    constructor() {

        super(
            CMPAdapterFactory.firebase("ledgerBatches")
        );

    }

}
