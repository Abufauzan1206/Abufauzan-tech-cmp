import {
    getFunctions,
    httpsCallable
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-functions.js";

const functions = getFunctions();

const getActiveCooperativesCallable = httpsCallable(
    functions,
    "getActiveCooperatives"
);

/**
 * Public cooperative discovery boundary.
 *
 * The client does not read the cooperatives collection
 * directly. The backend is responsible for exposing only
 * cooperatives that are eligible for public membership
 * applications.
 */
export async function getActiveCooperatives() {
    const result =
        await getActiveCooperativesCallable();

    if (!result?.data?.success) {
        throw new Error(
            result?.data?.message ||
            "Unable to load active cooperatives."
        );
    }

    if (!Array.isArray(result.data.cooperatives)) {
        throw new Error(
            "Invalid cooperative discovery response."
        );
    }

    return result.data.cooperatives;
}