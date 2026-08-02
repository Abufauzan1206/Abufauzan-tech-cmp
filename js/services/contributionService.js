/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Service Layer
 *
 * File: contributionService.js
 * Version: 2.0.0
 *
 * Contribution Business Service
 * =====================================================
 */

import { CMPRepositoryManager }
from "../repositories/repositoryManager.js";


const contributionRepository =
    CMPRepositoryManager.get("contribution");


export async function createContribution(data) {

    return await contributionRepository.create(data);

}


export async function getContributionById(id) {

    return await contributionRepository.findById(id);

}


export async function getAllContributions() {

    return await contributionRepository.findAll();

}


export async function updateContribution(id, data) {

    return await contributionRepository.update(id, data);

}


export async function deleteContribution(id) {

    return await contributionRepository.delete(id);

}
