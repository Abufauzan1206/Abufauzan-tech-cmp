/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Repository Module: RP-002
 *
 * File: repositoryManager.js
 * Version: 7.0.0
 *
 * Repository Registry & Access Manager
 * =====================================================
 */

import { CMPMemberRepository } from "./memberRepository.js";
import { CMPContributionRepository } from "./contributionRepository.js";
import { CMPTransactionRepository } from "./transactionRepository.js";
import { CMPLedgerRepository } from "./ledgerRepository.js";
import { CMPLedgerBatchRepository } from "./ledgerBatchRepository.js";
import { CMPTrialBalanceRepository } from "./trialBalanceRepository.js";
import { CMPGeneralLedgerRepository } from "./generalLedgerRepository.js";
import { CMPJournalRepository } from "./journalRepository.js";
import { CMPChartOfAccountsRepository } from "./chartOfAccountsRepository.js";
import { CMPAccountingPeriodRepository } from "./accountingPeriodRepository.js";
import { CMPFinancialYearRepository } from "./financialYearRepository.js";


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

    static ledgerBatch =
        new CMPLedgerBatchRepository();

    static trialBalance =
        new CMPTrialBalanceRepository();

    static generalLedger =
        new CMPGeneralLedgerRepository();

    static journal =
        new CMPJournalRepository();

    static chartOfAccounts =
        new CMPChartOfAccountsRepository();

    static accountingPeriod =
        new CMPAccountingPeriodRepository();

    static financialYear =
        new CMPFinancialYearRepository();



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
            "ledgerBatch",
            this.ledgerBatch
        );

        this.register(
            "trialBalance",
            this.trialBalance
        );

        this.register(
            "generalLedger",
            this.generalLedger
        );

        this.register(
            "journal",
            this.journal
        );

        this.register(
            "chartOfAccounts",
            this.chartOfAccounts
        );

        this.register(
            "accountingPeriod",
            this.accountingPeriod
        );

        this.register(
            "financialYear",
            this.financialYear
        );

    }



    static register(
        name,
        repository
    ) {

        if (this.repositories.has(name)) {

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
