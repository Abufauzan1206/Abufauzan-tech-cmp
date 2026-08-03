/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Repository Module
 *
 * File: accountingPeriodRepository.js
 * Version: 1.0.0
 *
 * Accounting Period Repository
 * =====================================================
 */

import { CMPBaseRepository } from "./baseRepository.js";
import { CMPAdapterFactory } from "../adapters/adapterFactory.js";

export class CMPAccountingPeriodRepository
    extends CMPBaseRepository {

    constructor() {

        super(
            CMPAdapterFactory.firebase(
                "accountingPeriods"
            )
        );

    }

}
