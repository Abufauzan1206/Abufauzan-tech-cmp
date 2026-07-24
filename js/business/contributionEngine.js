/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Business Module: BM-009
 *
 * File: contributionEngine.js
 * Version: 1.0.0
 * =====================================================
 */

import { CMPIdService } from "./idService.js";

import { CMPRepositoryManager } from "../repositories/repositoryManager.js";

export class CMPContributionEngine {

/**
 * Record a contribution
 */
static create(contribution) {

    const newContribution = {

        contributionId:
            CMPIdService.generate("CON"),

        createdAt:
            new Date(),

        status:
            "pending",

        ...contribution

    };

    CMPRepositoryManager
    .contribution
    .save(contribution);

    return newContribution;

}

    /**
     * Get all contributions
     */
    static getAll() {

        return CMPRepositoryManager
    .contribution
    .getAll();

    }

}