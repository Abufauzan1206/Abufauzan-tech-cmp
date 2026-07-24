/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Repository Module: RP-010
 *
 * File: firestoreMemberRepository.js
 * Version: 1.0.0
 * =====================================================
 */

import { CMPFirestoreRepository }
    from "./firestoreRepository.js";

export class CMPFirestoreMemberRepository
    extends CMPFirestoreRepository {

    constructor() {

        super("members");

    }

}