/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Cooperative Homepage Configuration Repository
 * =====================================================
 */

import { CMPBaseRepository } from "./baseRepository.js";
import { CMPAdapterFactory } from "../adapters/adapterFactory.js";

export class CMPCooperativeHomepageConfigRepository
    extends CMPBaseRepository {

    constructor() {
        super(
            CMPAdapterFactory.firebase(
                "cooperativeHomepageConfigs"
            )
        );
    }

    async saveForCooperative(cooperativeId, data = {}) {
        if (typeof cooperativeId !== "string") {
            throw new TypeError(
                "Cooperative ID must be a string."
            );
        }

        const normalizedCooperativeId =
            cooperativeId.trim();

        if (!normalizedCooperativeId) {
            throw new Error(
                "Cooperative ID is required."
            );
        }

        return await this.create(
            {
                cooperativeId: normalizedCooperativeId,
                ...data,
            },
            {
                documentId: normalizedCooperativeId,
            }
        );
    }

    async getForCooperative(cooperativeId) {
        if (typeof cooperativeId !== "string") {
            throw new TypeError(
                "Cooperative ID must be a string."
            );
        }

        const normalizedCooperativeId =
            cooperativeId.trim();

        if (!normalizedCooperativeId) {
            throw new Error(
                "Cooperative ID is required."
            );
        }

        return await this.findById(
            normalizedCooperativeId
        );
    }
}
