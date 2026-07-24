/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Repository Module: RP-007
 *
 * File: repositoryManager.js
 * Version: 1.0.0
 * =====================================================
 */

import { CMPMemberRepository } from "./memberRepository.js";
import { CMPContributionRepository } from "./contributionRepository.js";
import { CMPTransactionRepository } from "./transactionRepository.js";
import { CMPLedgerRepository } from "./ledgerRepository.js";
import { CMPJournalRepository } from "./journalRepository.js";

export class CMPRepositoryManager {

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

}