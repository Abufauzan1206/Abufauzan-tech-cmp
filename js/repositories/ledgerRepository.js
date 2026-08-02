/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Repository Module: RP-005
 *
 * File: ledgerRepository.js
 * Version: 2.0.0
 *
 * Adapter Based Ledger Repository
 * =====================================================
 */

import { CMPBaseRepository } from "./baseRepository.js";
import { CMPAdapterFactory } from "../adapters/adapterFactory.js";


export class CMPLedgerRepository
    extends CMPBaseRepository {


    constructor() {

        super(
            CMPAdapterFactory.firebase("ledgers")
        );

    }


}
