/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Business Module: BM-012
 *
 * File: ledgerEngine.js
 * Version: 1.0.0
 * =====================================================
 */

import { CMPIdService } from "./idService.js";

export class CMPLedgerEngine {

    static entries = [];

    /**
     * Create a ledger entry
     */
    static create(entry) {

        const newEntry = {

    ledgerId:
        CMPIdService.generate("LED"),

    transactionId:
        entry.transactionId ?? null,

    account:
        entry.account ?? null,

    debit:
        entry.debit ?? 0,

    credit:
        entry.credit ?? 0,

    currency:
        entry.currency ?? "NGN",

    description:
        entry.description ?? "",

    createdAt:
        new Date(),

    ...entry

};

        this.entries.push(
            newEntry
        );

        return newEntry;

    }

    /**
     * Get all ledger entries
     */
    static getAll() {

        return [...this.entries];

    }

}