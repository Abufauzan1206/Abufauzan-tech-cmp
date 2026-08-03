/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Repository Module
 *
 * File: periodLockRepository.js
 * Version: 1.0.0
 *
 * Period Lock Repository
 * =====================================================
 */

import { CMPBaseRepository } from "./baseRepository.js";
import { CMPAdapterFactory } from "../adapters/adapterFactory.js";

export class CMPPeriodLockRepository
    extends CMPBaseRepository {

    constructor() {

        super(
            CMPAdapterFactory.firebase(
                "periodLocks"
            )
        );

    }

}
