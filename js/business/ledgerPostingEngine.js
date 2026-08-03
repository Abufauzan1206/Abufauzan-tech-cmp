/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Business Engine Layer
 *
 * File: ledgerPostingEngine.js
 * Version: 1.0.0
 *
 * Ledger Posting Engine
 * =====================================================
 */

import {
    createLedger
} from "../services/ledgerService.js";

import {
    getNextSequence
} from "../services/counterService.js";

import {
    generateDocumentNumber
} from "../utils/generator.js";


export async function postLedger(data) {

    if (!data.account) {
        throw new Error("Ledger account is required.");
    }

    if (data.debit == null || data.credit == null) {
        throw new Error("Debit and Credit are required.");
    }

    const sequence = await getNextSequence("LED");

    const ledgerNumber =
        generateDocumentNumber("LED", sequence);

    const ledger = {
        ...data,
        ledgerNumber,
        status: "POSTED",
        createdAt: new Date().toISOString()
    };

    const result = await createLedger(ledger);

    return {
        success: true,
        ledgerNumber,
        documentId: result.id ?? result,
        message: "Ledger posted successfully."
    };

}
