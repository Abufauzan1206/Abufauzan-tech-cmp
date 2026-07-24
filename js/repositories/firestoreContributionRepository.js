/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Repository Module: RP-011
 *
 * File: firestoreContributionRepository.js
 * Version: 1.0.0
 * =====================================================
 */

import { CMPFirestoreRepository }
    from "./firestoreRepository.js";

export class CMPFirestoreContributionRepository
    extends CMPFirestoreRepository {

    constructor() {

        super("contributions");

    }

}