/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC127 - ROLE AUTHORIZATION FOUNDATION
 *
 * Purpose:
 * 1. Establish canonical internal role names.
 * 2. Preserve existing Firestore role aliases.
 * 3. Upgrade CMPAuth role checks.
 * 4. Keep Super Admin and Cooperative Admin compatible.
 *
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [

    {
        path: "js/components/roleAuthorization.js",
        mode: "create",
        search: "",
        replace: `/**
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
`
    },

    {
        path: "js/components/auth.js",
        mode: "regex",
        search: `import \\{ auth \\} from "\\.\\./firebase-config\\.js";`,
        replace: `import { auth } from "../firebase-config.js";
import {
    normalizeRole,
    rolesMatch
} from "./roleAuthorization.js";`
    },

    {
        path: "js/components/auth.js",
        mode: "regex",
        search: `static setRole\\(role\\) \\{[\\s\\S]*?\\n\\s*\\}`,
        replace: `static setRole(role) {
        this.role = normalizeRole(role);
    }`
    },

    {
        path: "js/components/auth.js",
        mode: "regex",
        search: `static hasRole\\(role\\) \\{[\\s\\S]*?\\n\\s*\\}`,
        replace: `static hasRole(role) {
        return rolesMatch(this.role, role);
    }`
    },

    {
        path: "js/components/auth.js",
        mode: "regex",
        search: `static isSuperAdmin\\(\\) \\{[\\s\\S]*?\\n\\s*\\}`,
        replace: `static isSuperAdmin() {
        return this.hasRole("super_admin");
    }`
    },

    {
        path: "js/components/auth.js",
        mode: "regex",
        search: `static isCooperativeAdmin\\(\\) \\{[\\s\\S]*?\\n\\s*\\}`,
        replace: `static isCooperativeAdmin() {
        return this.hasRole("cooperative_admin");
    }`
    },

    {
        path: "js/components/auth.js",
        mode: "regex",
        search: `static isMember\\(\\) \\{[\\s\\S]*?\\n\\s*\\}`,
        replace: `static isMember() {
        return this.hasRole("member");
    }`
    },

    {
        path: "tools/patchAssistant/test/testRoleAuthorization.js",
        mode: "create",
        search: "",
        replace: `/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC127 - ROLE AUTHORIZATION TEST
 *
 * =====================================================
 */

import {
    normalizeRole,
    rolesMatch
} from "../../js/components/roleAuthorization.js";

console.log("=========================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC127 - ROLE AUTHORIZATION TEST");
console.log("=========================================");

let failed = false;

function check(label, actual, expected) {

    if (actual !== expected) {
        console.log("FAIL:", label);
        console.log("Expected:", expected);
        console.log("Actual:", actual);
        failed = true;
        return;
    }

    console.log("PASS:", label);
}

check(
    "superAdmin normalizes to super_admin",
    normalizeRole("superAdmin"),
    "super_admin"
);

check(
    "super_admin remains super_admin",
    normalizeRole("super_admin"),
    "super_admin"
);

check(
    "cooperativeAdmin normalizes to cooperative_admin",
    normalizeRole("cooperativeAdmin"),
    "cooperative_admin"
);

check(
    "cooperative_admin remains cooperative_admin",
    normalizeRole("cooperative_admin"),
    "cooperative_admin"
);

check(
    "member remains member",
    normalizeRole("member"),
    "member"
);

check(
    "superAdmin matches super_admin",
    rolesMatch("superAdmin", "super_admin"),
    true
);

check(
    "super_admin matches superAdmin",
    rolesMatch("super_admin", "superAdmin"),
    true
);

check(
    "cooperativeAdmin matches cooperative_admin",
    rolesMatch("cooperativeAdmin", "cooperative_admin"),
    true
);

check(
    "cooperative_admin matches cooperativeAdmin",
    rolesMatch("cooperative_admin", "cooperativeAdmin"),
    true
);

check(
    "member matches member",
    rolesMatch("member", "member"),
    true
);

check(
    "member does not match cooperative_admin",
    rolesMatch("member", "cooperative_admin"),
    false
);

if (failed) {
    console.log("=========================================");
    console.log("RC127 ROLE AUTHORIZATION TEST: FAIL");
    console.log("=========================================");
    process.exitCode = 1;
    process.exit();
}

console.log("=========================================");
console.log("RC127 ROLE AUTHORIZATION TEST: PASS");
console.log("=========================================");
`
    }

];

async function run() {

    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC127 - ROLE AUTHORIZATION FOUNDATION");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC127 TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {

        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC127 PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC127 PATCH COMPLETE");
    console.log("=========================================");
}

run();
