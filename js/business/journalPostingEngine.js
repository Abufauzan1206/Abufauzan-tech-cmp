/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Business Module: BM-013A
 *
 * File: journalPostingEngine.js
 * Version: 1.0.0
 * =====================================================
 */

import { CMPJournalEngine } from "./journalEngine.js";
import { CMPLedgerEngine } from "./ledgerEngine.js";

export class CMPJournalPostingEngine {

    /**
     * Post a validated journal
     */
    static post(journal) {

        // Ensure journal is valid
        CMPJournalEngine.validate(journal);

        for (const entry of journal.entries) {
            CMPLedgerEngine.post(entry);
        }

        return {
            success: true,
            postedAt: new Date(),
            journalId: journal.journalId
        };

    }

}
