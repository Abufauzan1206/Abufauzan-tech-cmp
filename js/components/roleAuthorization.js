/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Role Authorization Utility
 * Version: 1.0.0
 *
 * =====================================================
 */

/**
 * Normalize supported role aliases to canonical roles.
 */
export function normalizeRole(role) {

    if (!role) {
        return null;
    }

    const aliases = {
        superAdmin: "super_admin",
        super_admin: "super_admin",

        cooperativeAdmin: "cooperative_admin",
        cooperative_admin: "cooperative_admin",

        member: "member"
    };

    return aliases[role] || role;
}

/**
 * Compare two roles using their canonical representation.
 */
export function rolesMatch(actualRole, expectedRole) {

    return (
        normalizeRole(actualRole) ===
        normalizeRole(expectedRole)
    );
}
