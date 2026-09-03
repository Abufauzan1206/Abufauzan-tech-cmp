/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Repository Module: RP-012
 * File: membershipApplicationRepository.js
 * Version: 1.0.0
 * Adapter Based Membership Application Repository
 * =====================================================
 */

import { CMPBaseRepository } from "./baseRepository.js";
import { CMPAdapterFactory } from "../adapters/adapterFactory.js";

export class CMPMembershipApplicationRepository
    extends CMPBaseRepository {

    constructor() {
        super(
            CMPAdapterFactory.firebase("membershipApplications")
        );
    }

    async findAllByCooperativeId(cooperativeId) {
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

        return await this.adapter.findAllByCooperativeId(
            normalizedCooperativeId
        );
    }
}
