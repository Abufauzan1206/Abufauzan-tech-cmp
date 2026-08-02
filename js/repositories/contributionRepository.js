/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Repository Module: RP-003
 *
 * File: contributionRepository.js
 * Version: 2.0.0
 *
 * Adapter Based Contribution Repository
 * =====================================================
 */

import { CMPBaseRepository } from "./baseRepository.js";
import { CMPAdapterFactory } from "../adapters/adapterFactory.js";


export class CMPContributionRepository
    extends CMPBaseRepository {


    constructor() {

        super(
            CMPAdapterFactory.firebase("contributions")
        );

    }


}
