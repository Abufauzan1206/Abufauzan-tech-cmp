import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "js/repositories/membershipApplicationRepository.js",
        mode: "create",
        replace: `/**
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
}
`
    },
    {
        path: "js/business/membershipApplicationEngine.js",
        mode: "create",
        replace: `/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Business Module: BM-002
 * File: membershipApplicationEngine.js
 * Version: 1.0.0
 * Membership Application Foundation
 * =====================================================
 */

import { CMPIdService } from "./idService.js";
import { CMPRepositoryManager } from "../repositories/repositoryManager.js";

export class CMPMembershipApplicationEngine {

    /**
     * Create a pending membership application.
     *
     * This is intentionally separate from
     * CMPMemberEngine.register(), which creates an
     * active member directly for authorized staff.
     */
    static async submit(application) {

        if (!application || typeof application !== "object") {
            throw new TypeError(
                "Membership application data is required."
            );
        }

        if (!application.cooperativeId) {
            throw new Error(
                "Cooperative ID is required."
            );
        }

        if (!application.fullName) {
            throw new Error(
                "Applicant full name is required."
            );
        }

        if (!application.phone) {
            throw new Error(
                "Applicant phone is required."
            );
        }

        const newApplication = {
            ...application,
            applicationId: CMPIdService.generate("MAP"),
            status: "pending",
            submittedAt: new Date()
        };

        await CMPRepositoryManager
            .membershipApplication
            .create(newApplication);

        return newApplication;
    }

    /**
     * Retrieve one membership application.
     */
    static async getById(applicationId) {
        return await CMPRepositoryManager
            .membershipApplication
            .findById(applicationId);
    }

    /**
     * Retrieve all membership applications.
     */
    static async getAll() {
        return await CMPRepositoryManager
            .membershipApplication
            .findAll();
    }
}
`
    },
    {
        path: "js/services/membershipApplicationService.js",
        mode: "create",
        replace: `/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Service Module
 * File: membershipApplicationService.js
 * Version: 1.0.0
 * =====================================================
 */

import { CMPMembershipApplicationEngine }
    from "../business/membershipApplicationEngine.js";

export async function submitMembershipApplication(data) {
    return await CMPMembershipApplicationEngine.submit(data);
}

export async function getMembershipApplicationById(applicationId) {
    return await CMPMembershipApplicationEngine.getById(
        applicationId
    );
}

export async function getMembershipApplications() {
    return await CMPMembershipApplicationEngine.getAll();
}
`
    },
    {
        path: "js/repositories/repositoryManager.js",
        search: `import { CMPMemberRepository } from "./memberRepository.js";`,
        replace: `import { CMPMemberRepository } from "./memberRepository.js";
import { CMPMembershipApplicationRepository } from "./membershipApplicationRepository.js";`
    },
    {
        path: "js/repositories/repositoryManager.js",
        search: `    static member =
        new CMPMemberRepository();`,
        replace: `    static member =
        new CMPMemberRepository();

    static membershipApplication =
        new CMPMembershipApplicationRepository();`
    },
    {
        path: "js/repositories/repositoryManager.js",
        search: `        this.register(
            "member",
            this.member
        );`,
        replace: `        this.register(
            "member",
            this.member
        );

        this.register(
            "membershipApplication",
            this.membershipApplication
        );`
    }
];

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D56 — MEMBERSHIP APPLICATION FOUNDATION");
console.log("===============================================");
console.log("PATCH COUNT:", patches.length);
console.log("");

try {
    const result = await transaction(patches);

    console.log("PATCH ENGINE RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;
    }

    console.log("");
    console.log(
        result.success
            ? "RC406-D56 MEMBERSHIP APPLICATION FOUNDATION: PASS"
            : "RC406-D56 MEMBERSHIP APPLICATION FOUNDATION: FAIL"
    );
} catch (error) {
    console.error(
        "RC406-D56 PATCH ERROR:",
        error.message
    );
    process.exitCode = 1;
}

console.log("===============================================");
