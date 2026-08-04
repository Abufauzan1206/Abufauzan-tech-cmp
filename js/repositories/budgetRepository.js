/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Repository Module
 *
 * File: budgetRepository.js
 * Version: 1.0.0
 *
 * Budget Repository
 * =====================================================
 */

import { CMPBaseRepository } from "./baseRepository.js";
import { CMPAdapterFactory } from "../adapters/adapterFactory.js";

export class CMPBudgetRepository
    extends CMPBaseRepository {

    constructor() {

        super(

            CMPAdapterFactory.firebase(
                "budgets"
            )

        );

    }

}
