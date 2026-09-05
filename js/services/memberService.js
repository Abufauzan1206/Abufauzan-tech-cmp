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
import { CMPMemberEngine }
from "../business/memberEngine.js";


const memberRepository =
    CMPRepositoryManager.get("member");


export async function createMember(data) {

    return await memberRepository.create(data);

}


export async function getMemberById(id) {

    return await memberRepository.findById(id);

}


export async function getAllMembers() {

    const { getAuthenticatedProfile } = await import(
        "../controllers/accessController.js"
    );

    const session = await getAuthenticatedProfile();

    if (!session) {
        throw new Error("Authenticated user required.");
    }

    const role = session.profile?.role;

    if (
        role === "cooperative_admin" ||
        role === "cooperativeAdmin"
    ) {
        const cooperativeId =
            session.profile?.cooperativeId;

        if (
            typeof cooperativeId !== "string" ||
            !cooperativeId.trim()
        ) {
            throw new Error(
                "Cooperative administrator profile has no cooperativeId."
            );
        }

        return await memberRepository.findAllByCooperativeId(
            cooperativeId.trim()
        );
    }

    return await memberRepository.findAll();

}


export async function updateMember(id, data) {

    return await memberRepository.update(id, data);

}


export async function deleteMember(id) {
    return await memberRepository.delete(id);
}

export async function registerMember(data) {
    return await CMPMemberEngine.register(data);
}
