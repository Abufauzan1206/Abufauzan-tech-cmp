/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Repository Module: RP-006
 *
 * File: journalRepository.js
 * Version: 2.0.0
 *
 * Adapter Based Journal Repository
 * =====================================================
 */

import { CMPBaseRepository } from "./baseRepository.js";
import { CMPAdapterFactory } from "../adapters/adapterFactory.js";


export class CMPJournalRepository
    extends CMPBaseRepository {


    constructor() {

        super(
            CMPAdapterFactory.firebase("journals")
        );

    }


}
