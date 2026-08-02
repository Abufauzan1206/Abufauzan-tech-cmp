/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Repository Module: RP-002
 *
 * File: repositoryManager.js
 * Version: 2.0.0
 *
 * Repository Registry & Access Manager
 * =====================================================
 */


import { CMPMemberRepository } from "./memberRepository.js";
import { CMPContributionRepository } from "./contributionRepository.js";
import { CMPTransactionRepository } from "./transactionRepository.js";
import { CMPLedgerRepository } from "./ledgerRepository.js";
import { CMPJournalRepository } from "./journalRepository.js";
import { CMPChartOfAccountsRepository } from "./chartOfAccountsRepository.js";


export class CMPRepositoryManager {


    static repositories = new Map();



    static member =
        new CMPMemberRepository();


    static contribution =
        new CMPContributionRepository();


    static transaction =
        new CMPTransactionRepository();


    static ledger =
        new CMPLedgerRepository();


    static journal =
        new CMPJournalRepository();


    static chartOfAccounts =
        new CMPChartOfAccountsRepository();



    static initialize() {


        this.register(
            "member",
            this.member
        );


        this.register(
            "contribution",
            this.contribution
        );


        this.register(
            "transaction",
            this.transaction
        );


        this.register(
            "ledger",
            this.ledger
        );


        this.register(
            "journal",
            this.journal
        );


        this.register(
            "chartOfAccounts",
            this.chartOfAccounts
        );


    }



    static register(
        name,
        repository
    ) {


        if (
            this.repositories.has(name)
        ) {

            return false;

        }


        this.repositories.set(
            name,
            repository
        );


        return true;

    }



    static get(name) {


        return this.repositories.get(name);

    }



    static getAll() {


        return this.repositories;

    }



}



CMPRepositoryManager.initialize();
