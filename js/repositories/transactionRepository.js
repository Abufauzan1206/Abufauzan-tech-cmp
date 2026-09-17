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

        const result = await super.create(
            data,
            {
                documentId: data.transactionId
            }
        );

        return {
            id:
                typeof result === "string"
                    ? result
                    : result?.id ?? data.transactionId,
            ...data
        };
    }

}
