/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Business Module: BM-013
 *
 * File: journalEngine.js
 * Version: 1.0.0
 * =====================================================
 */

import { CMPIdService } from "./idService.js";

export class CMPJournalEngine {

    static journals = [];

    /**
     * Record a journal entry
     */
    static create(entry) {

        const journal = {

            journalId:
                CMPIdService.generate("JRN"),

            createdAt:
                new Date(),

            ...entry

        };

        this.journals.push(journal);

        return journal;

    }

    /**
     * Get all journal entries
     */
    static getAll() {

        return [...this.journals];

    }

    /**
     * Validate a journal before posting
     */
    static validate(journal) {

        if (!journal.entries || !Array.isArray(journal.entries)) {
            throw new Error("Journal entries are required.");
        }

        let totalDebit = 0;
        let totalCredit = 0;

        for (const entry of journal.entries) {
            totalDebit += Number(entry.debit || 0);
            totalCredit += Number(entry.credit || 0);
        }

        if (totalDebit !== totalCredit) {
            throw new Error(
                `Journal is not balanced. Debit=${totalDebit}, Credit=${totalCredit}`
            );
        }

        return true;

    }
}
