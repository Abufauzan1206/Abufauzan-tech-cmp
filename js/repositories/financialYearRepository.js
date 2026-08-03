/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Repository Module
 *
 * File: financialYearRepository.js
 * Version: 1.0.0
 *
 * Financial Year Repository
 * =====================================================
 */

import { 
    CMPBaseRepository 
} from "./baseRepository.js";

import {
    CMPAdapterFactory
} from "../adapters/adapterFactory.js";


export class CMPFinancialYearRepository
    extends CMPBaseRepository {

    constructor() {

        super(
            CMPAdapterFactory.firebase(
                "financialYears"
            )
        );

    }

}
