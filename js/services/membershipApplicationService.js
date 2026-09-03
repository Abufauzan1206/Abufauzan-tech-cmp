/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Service Module
 * File: membershipApplicationService.js
 * Version: 1.0.0
 * =====================================================
 */

import { CMPMembershipApplicationEngine }
    from "../business/membershipApplicationEngine.js";

import {
    getFunctions,
    httpsCallable
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-functions.js";

const functions = getFunctions();

const submitMembershipApplicationCallable =
    httpsCallable(
        functions,
        "submitMembershipApplication"
    );

export async function submitMembershipApplication(data) {
    if (!data || typeof data !== "object") {
        throw new TypeError(
            "Membership application data is required."
        );
    }

    const result =
        await submitMembershipApplicationCallable(data);

    if (!result?.data?.success) {
        throw new Error(
            result?.data?.message ||
            "Unable to submit membership application."
        );
    }

    return result.data;
}

export async function getMembershipApplicationById(applicationId) {
    return await CMPMembershipApplicationEngine.getById(
        applicationId
    );
}

export async function getMembershipApplications() {
    return await CMPMembershipApplicationEngine.getAll();
}

/**
 * Retrieve membership applications belonging to one cooperative.
 */
export async function getMembershipApplicationsByCooperativeId(
    cooperativeId
) {
    return await CMPMembershipApplicationEngine
        .getByCooperativeId(cooperativeId);
}

const getPendingMembershipApplicationsCallable =
    httpsCallable(
        functions,
        "getPendingMembershipApplications"
    );

const approveMembershipApplicationCallable =
    httpsCallable(
        functions,
        "approveMembershipApplication"
    );

const rejectMembershipApplicationCallable =
    httpsCallable(
        functions,
        "rejectMembershipApplication"
    );

export async function getPendingMembershipApplications() {
    const result =
        await getPendingMembershipApplicationsCallable();

    if (!result?.data?.success) {
        throw new Error(
            result?.data?.message ||
            "Unable to load pending membership applications."
        );
    }

    if (!Array.isArray(result.data.applications)) {
        throw new Error(
            "Invalid pending membership applications response."
        );
    }

    return result.data.applications;
}

export async function approveMembershipApplication(
    applicationId
) {
    if (
        typeof applicationId !== "string" ||
        !applicationId.trim()
    ) {
        throw new TypeError(
            "Membership application ID is required."
        );
    }

    const result =
        await approveMembershipApplicationCallable({
            applicationId: applicationId.trim()
        });

    if (!result?.data?.success) {
        throw new Error(
            result?.data?.message ||
            "Unable to approve membership application."
        );
    }

    return result.data;
}

export async function rejectMembershipApplication(
    applicationId
) {
    if (
        typeof applicationId !== "string" ||
        !applicationId.trim()
    ) {
        throw new TypeError(
            "Membership application ID is required."
        );
    }

    const result =
        await rejectMembershipApplicationCallable({
            applicationId: applicationId.trim()
        });

    if (!result?.data?.success) {
        throw new Error(
            result?.data?.message ||
            "Unable to reject membership application."
        );
    }

    return result.data;
}
