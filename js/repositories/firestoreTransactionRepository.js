/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Repository Module: RP-012
 *
 * File: firestoreTransactionRepository.js
 * Version: 1.0.0
 * =====================================================
 */

import { CMPFirestoreRepository }
    from "./firestoreRepository.js";

export class CMPFirestoreTransactionRepository
    extends CMPFirestoreRepository {

    constructor() {

        super("transactions");

    }

}