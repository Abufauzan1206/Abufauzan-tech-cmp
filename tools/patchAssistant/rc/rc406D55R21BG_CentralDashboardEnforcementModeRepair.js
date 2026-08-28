import fs from "fs";
import { patch } from "../patchEngine.js";

const path = "js/controllers/accessController.js";
const source = fs.readFileSync(path, "utf8");

const search = `export async function enforceDashboardAccess(requestedRole = null) {
    const result = await resolveAccess(requestedRole);

    if (!result.allowed) {
        if (result.reason === "AUTHENTICATION_REQUIRED") {
            window.location.href =
                resolveAppRoute("login.html");
        }

        return result;
    }

    const destinationUrl = result.destination
        ? new URL(
            result.destination,
            APP_BASE_URL
        )
        : null;

    const currentUrl = new URL(
        window.location.href
    );

    if (
        destinationUrl &&
        currentUrl.pathname !== destinationUrl.pathname
    ) {
        window.location.href =
            destinationUrl.href;
    }

    return result;
}`;

const replace = `export async function enforceDashboardAccess(
    requestedRole = null,
    options = {}
) {
    const {
        requireRequestedRole = false
    } = options;

    const session = await getAuthenticatedProfile();

    if (!session) {
        window.location.href =
            resolveAppRoute("login.html");

        return {
            allowed: false,
            reason: "AUTHENTICATION_REQUIRED",
            destination: "login.html"
        };
    }

    const actualRole =
        normalizeRole(session.profile.role);

    /*
     * Dashboard enforcement is based on the
     * Firebase-UID-bound authoritative profile.
     *
     * If a caller explicitly requires Login-as
     * selection, preserve the existing selection
     * contract.
     */
    if (!requestedRole && requireRequestedRole) {
        return {
            allowed: false,
            reason: "LOGIN_AS_SELECTION_REQUIRED",
            actualRole
        };
    }

    /*
     * No requested role means direct dashboard
     * enforcement. The authenticated user's
     * authoritative role owns the destination.
     */
    const effectiveRequestedRole =
        requestedRole || actualRole;

    const result =
        await resolveAccess(effectiveRequestedRole);

    if (!result.allowed) {
        if (result.reason === "AUTHENTICATION_REQUIRED") {
            window.location.href =
                resolveAppRoute("login.html");
        }

        return result;
    }

    const destinationUrl = result.destination
        ? new URL(
            result.destination,
            APP_BASE_URL
        )
        : null;

    const currentUrl = new URL(
        window.location.href
    );

    if (
        destinationUrl &&
        currentUrl.pathname !== destinationUrl.pathname
    ) {
        window.location.href =
            destinationUrl.href;
    }

    return result;
}`;

if (!source.includes(search)) {
    throw new Error(
        "BG target enforcement contract not found; refusing non-deterministic patch."
    );
}

const result = await patch({
    path,
    mode: "exact",
    search,
    replace
});

if (!result.success) {
    throw new Error(
        "BG central enforcement repair failed."
    );
}

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D55R21-BG — CENTRAL DASHBOARD ENFORCEMENT MODE REPAIR");
console.log("===============================================");
console.log("BG-1: Firebase UID/profile remains authoritative.");
console.log("BG-2: Direct dashboard enforcement derives role from authenticated profile.");
console.log("BG-3: Login-as selection contract remains explicitly enforceable.");
console.log("BG-4: Wrong dashboard destinations are centrally corrected.");
console.log("===============================================");
console.log("RC406-D55R21-BG REPAIR COMPLETE");
