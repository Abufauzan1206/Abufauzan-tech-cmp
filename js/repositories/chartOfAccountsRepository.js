/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Repository Module: RP-012
 *
 * File: chartOfAccountsRepository.js
 * Version: 2.0.0
 *
 * Chart of Accounts Repository
 * =====================================================
 */

import { CMPBaseRepository } from "./baseRepository.js";
import { CMPAdapterFactory } from "../adapters/adapterFactory.js";

export class CMPChartOfAccountsRepository
    extends CMPBaseRepository {

    constructor() {

        super(
            CMPAdapterFactory.firebase("chartOfAccounts")
        );

    }

}
