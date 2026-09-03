import { patch } from "../patchEngine.js";

const result = await patch({
    path: "js/services/membershipApplicationService.js",
    search: `export async function getMembershipApplicationsByCooperativeId(
    cooperativeId
) {
    return await CMPMembershipApplicationEngine
        .getByCooperativeId(cooperativeId);
}
`,
    replace: `export async function getMembershipApplicationsByCooperativeId(
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
`
});

console.log(
    "RC406-D70 PATCH ENGINE RESULT:",
    JSON.stringify(result, null, 2)
);
