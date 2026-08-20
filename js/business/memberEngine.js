/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Business Module: BM-001
 *
 * File: memberEngine.js
 * Version: 1.0.0
 * =====================================================
 */
 
 import { CMPIdService } from "./idService.js";
 
 import { CMPMemberValidationService } from "./memberValidationService.js";

import { CMPEventBus } from "../core/eventBus.js";
import { CMPAuditService } from "../core/auditService.js";

import { CMPRepositoryManager } from "../repositories/repositoryManager.js";

export class CMPMemberEngine {

    /**
 * Register a new member
 */
static register(member) {
  
  CMPMemberValidationService.validate(member);

    const newMember = {

        memberId: CMPIdService.generate("MEM"),

        createdAt: new Date(),

        status: "active",

        ...member

    };

    CMPRepositoryManager
    .member
    .create(newMember);

    CMPAuditService.log(
    "MEMBER_REGISTERED",
    newMember
);

CMPEventBus.emit(
    "member:registered",
    newMember
);

    return newMember;

}

    /**
     * Get all members
     */
    static getAll() {

    return CMPRepositoryManager
        .member
        .findAll();

}

}