/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Service Layer
 *
 * File: journalService.js
 * Version: 1.0.0
 *
 * Journal Business Service
 * =====================================================
 */


import { CMPRepositoryManager } 
from "../repositories/repositoryManager.js";


const journalRepository =
    CMPRepositoryManager.get("journal");



export async function createJournal(data) {

    return await journalRepository.create(data);

}



export async function getJournalById(id) {

    return await journalRepository.findById(id);

}



export async function getAllJournals() {

    return await journalRepository.findAll();

}



export async function updateJournal(id, data) {

    return await journalRepository.update(id, data);

}



export async function deleteJournal(id) {

    return await journalRepository.delete(id);

}

export async function findJournalByReference(reference) {

    const journals =
        await journalRepository.findAll();

    return journals.find(

        journal =>
            journal.reference === reference

    ) || null;

}
