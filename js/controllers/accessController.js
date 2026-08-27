/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Central Access Controller
 * RC406-D50
 * =====================================================
 */

import { auth, db } from "../firebase-config.js";
import {
    normalizeRole,
    rolesMatch
} from "../components/roleAuthorization.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const DASHBOARD_ROUTES = Object.freeze({
    cooperative_admin: "cooperative-admin.html",
    member: "modules/member-portal/index.html"
});

export async function getAuthenticatedProfile() {
    const user = auth.currentUser;

    if (!user) {
        return null;
    }

    const profileSnap = await getDoc(
        doc(db, "users", user.uid)
    );

    if (!profileSnap.exists()) {
        return null;
    }

    return {
        uid: user.uid,
        user,
        profile: profileSnap.data()
    };
}

export async function resolveAccess(requestedRole = null) {
    const session = await getAuthenticatedProfile();

    if (!session) {
        return {
            allowed: false,
            reason: "AUTHENTICATION_REQUIRED",
            destination: "login.html"
        };
    }

    const actualRole = normalizeRole(session.profile.role);

    /*
     * Super Admin is automatic.
     * It is deliberately NOT a selectable Login-as category.
     */
    if (rolesMatch(actualRole, "super_admin")) {
        return {
            allowed: true,
            role: "super_admin",
            automatic: true,
            destination: "super-admin.html"
        };
    }

    /*
     * Only dashboard roles may be requested through Login-as.
     */
    if (!requestedRole) {
        return {
            allowed: false,
            reason: "LOGIN_AS_SELECTION_REQUIRED"
        };
    }

    const requested = normalizeRole(requestedRole);

    /*
     * Critical Login-as authorization gate:
     * requested category MUST equal the authenticated
     * user's authoritative role.
     */
    if (!rolesMatch(actualRole, requested)) {
        return {
            allowed: false,
            reason: "LOGIN_AS_ROLE_MISMATCH",
            actualRole
        };
    }

    const destination = DASHBOARD_ROUTES[actualRole];

    if (!destination) {
        return {
            allowed: false,
            reason: "NO_DASHBOARD_ROUTE",
            actualRole
        };
    }

    return {
        allowed: true,
        role: actualRole,
        automatic: false,
        destination
    };
}

export async function enforceDashboardAccess(requestedRole = null) {
    const result = await resolveAccess(requestedRole);

    if (!result.allowed) {
        if (result.reason === "AUTHENTICATION_REQUIRED") {
            window.location.href = "login.html";
        }

        return result;
    }

    const currentPage = window.location.pathname;

    if (
        result.destination &&
        !currentPage.endsWith(result.destination)
    ) {
        window.location.href = result.destination;
    }

    return result;
}

export function watchAuthentication(callback) {
    return onAuthStateChanged(auth, callback);
}

export async function logout() {
    await signOut(auth);
}
