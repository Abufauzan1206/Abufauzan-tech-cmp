/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Repository Module: RP-013
 *
 * File: repositoryFactory.js
 * Version: 1.0.0
 * =====================================================
 */

import { CMPMemberRepository } from "./memberRepository.js";
import { CMPContributionRepository } from "./contributionRepository.js";
import { CMPTransactionRepository } from "./transactionRepository.js";

import { CMPFirestoreMemberRepository } from "./firestoreMemberRepository.js";
import { CMPFirestoreContributionRepository } from "./firestoreContributionRepository.js";
import { CMPFirestoreTransactionRepository } from "./firestoreTransactionRepository.js";

export class CMPRepositoryFactory {

    static useFirestore = false;

    static member() {

        return this.useFirestore
            ? new CMPFirestoreMemberRepository()
            : new CMPMemberRepository();

    }

    static contribution() {

        return this.useFirestore
            ? new CMPFirestoreContributionRepository()
            : new CMPContributionRepository();

    }

    static transaction() {

        return this.useFirestore
            ? new CMPFirestoreTransactionRepository()
            : new CMPTransactionRepository();

    }

}