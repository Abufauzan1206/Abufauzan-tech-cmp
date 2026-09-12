/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Repository Module: RP-004
 *
 * File: transactionRepository.js
 * Version: 2.0.0
 *
 * Adapter Based Transaction Repository
 * =====================================================
 */

import { CMPBaseRepository } from "./baseRepository.js";
import { CMPAdapterFactory } from "../adapters/adapterFactory.js";
import { db } from "../firebase-config.js";
import {
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
export class CMPTransactionRepository
    extends CMPBaseRepository {


    constructor() {

        super(
            CMPAdapterFactory.firebase("transactions")
        );

    }


    async create(data) {
        if (!data || typeof data !== "object") {
            throw new TypeError("Transaction data must be an object.");
        }

        if (!data.transactionId) {
            throw new TypeError("Transaction ID is required.");
        }

        await setDoc(
            doc(db, "transactions", data.transactionId),
            data
        );

        return {
            id: data.transactionId,
            ...data
        };
    }

}
