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

}