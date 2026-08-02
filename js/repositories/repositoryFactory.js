/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Repository Module: RP-013
 *
 * File: repositoryFactory.js
 * Version: 2.0.0
 *
 * Adapter Based Repository Factory
 * =====================================================
 */


import { CMPAdapterFactory } from "../adapters/adapterFactory.js";


import { CMPMemberRepository } 
from "./memberRepository.js";

import { CMPContributionRepository } 
from "./contributionRepository.js";

import { CMPTransactionRepository } 
from "./transactionRepository.js";

import { CMPJournalRepository } 
from "./journalRepository.js";



export class CMPRepositoryFactory {


    static member() {

        return new CMPMemberRepository(
            CMPAdapterFactory.firebase("members")
        );

    }



    static contribution() {

        return new CMPContributionRepository(
            CMPAdapterFactory.firebase("contributions")
        );

    }



    static transaction() {

        return new CMPTransactionRepository(
            CMPAdapterFactory.firebase("transactions")
        );

    }



    static journal() {

        return new CMPJournalRepository(
            CMPAdapterFactory.firebase("journals")
        );

    }


}
