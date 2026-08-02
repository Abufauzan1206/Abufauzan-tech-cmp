/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Service Layer
 *
 * File: memberService.js
 * Version: 2.0.0
 *
 * Member Business Service
 * =====================================================
 */

import { CMPRepositoryManager }
from "../repositories/repositoryManager.js";


const memberRepository =
    CMPRepositoryManager.get("member");


export async function createMember(data) {

    return await memberRepository.create(data);

}


export async function getMemberById(id) {

    return await memberRepository.findById(id);

}


export async function getAllMembers() {

    return await memberRepository.findAll();

}


export async function updateMember(id, data) {

    return await memberRepository.update(id, data);

}


export async function deleteMember(id) {

    return await memberRepository.delete(id);

}
