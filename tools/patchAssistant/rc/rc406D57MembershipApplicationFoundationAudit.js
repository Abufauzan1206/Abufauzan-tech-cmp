import { CMPRepositoryManager } from "../../..//js/repositories/repositoryManager.js";
import { CMPMembershipApplicationEngine } from "../../..//js/business/membershipApplicationEngine.js";

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D57 — MEMBERSHIP APPLICATION FOUNDATION AUDIT");
console.log("===============================================");

let passed = true;

try {
    const repository =
        CMPRepositoryManager.get("membershipApplication");

    if (!repository) {
        throw new Error(
            "membershipApplication repository is not registered."
        );
    }

    console.log("REPOSITORY_REGISTERED: PASS");

    const collectionName =
        repository.adapter?.collectionName;

    if (collectionName !== "membershipApplications") {
        throw new Error(
            `Unexpected collection: ${collectionName}`
        );
    }

    console.log(
        "COLLECTION_CONTRACT: PASS — membershipApplications"
    );

    if (
        typeof CMPMembershipApplicationEngine.submit !==
        "function"
    ) {
        throw new Error(
            "Membership application submit engine is missing."
        );
    }

    console.log("SUBMISSION_ENGINE: PASS");

    if (
        typeof CMPMembershipApplicationEngine.getById !==
        "function" ||
        typeof CMPMembershipApplicationEngine.getAll !==
        "function"
    ) {
        throw new Error(
            "Membership application retrieval contract is incomplete."
        );
    }

    console.log("RETRIEVAL_ENGINE: PASS");

    console.log("");
    console.log(
        "RC406-D57 MEMBERSHIP APPLICATION FOUNDATION AUDIT: PASS"
    );
} catch (error) {
    passed = false;

    console.error(
        "RC406-D57 AUDIT ERROR:",
        error.message
    );

    console.log("");
    console.log(
        "RC406-D57 MEMBERSHIP APPLICATION FOUNDATION AUDIT: FAIL"
    );

    process.exitCode = 1;
}

console.log("===============================================");
