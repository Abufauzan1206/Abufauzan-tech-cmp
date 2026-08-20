/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC131 - LOGOUT & SESSION TERMINATION INTEGRATION
 *
 * Purpose:
 * 1. Verify CMPAuth exposes logout functionality.
 * 2. Verify CMPAuth.logout() uses Firebase signOut.
 * 3. Verify Super Admin dashboard terminates sessions.
 * 4. Verify Cooperative Admin dashboard terminates sessions.
 * 5. Verify logout routes to login.html.
 * 6. Verify protected dashboards terminate invalid sessions.
 * 7. Verify role authorization remains isolated.
 *
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "tools/patchAssistant/test/testLogoutSessionTerminationIntegration.js",
        mode: "create",
        search: "",
        replace: `/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC131 - LOGOUT & SESSION TERMINATION INTEGRATION TEST
 *
 * =====================================================
 */

import fs from "fs";

import {
    normalizeRole,
    rolesMatch
} from "../../../js/components/roleAuthorization.js";

console.log("=========================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC131 - LOGOUT & SESSION TERMINATION INTEGRATION TEST");
console.log("=========================================");

let failed = false;

function assert(condition, message) {
    if (condition) {
        console.log("PASS:", message);
    } else {
        console.log("FAIL:", message);
        failed = true;
    }
}

/* =========================================
   CMP AUTH LOGOUT CONTRACT
   ========================================= */

const cmpAuthSource = fs.readFileSync(
    "js/components/auth.js",
    "utf8"
);

assert(
    cmpAuthSource.includes("static async logout()"),
    "CMPAuth exposes a logout method"
);

assert(
    cmpAuthSource.includes("signOut(auth)"),
    "CMPAuth.logout() terminates the Firebase session"
);

assert(
    cmpAuthSource.includes("signOut"),
    "CMPAuth imports Firebase signOut"
);

/* =========================================
   SUPER ADMIN SESSION TERMINATION
   ========================================= */

const superAdminSource = fs.readFileSync(
    "js/super-admin.js",
    "utf8"
);

assert(
    superAdminSource.includes("signOut(auth)"),
    "Super Admin dashboard uses Firebase signOut"
);

assert(
    superAdminSource.includes('window.location.href = "login.html"'),
    "Super Admin logout/session failure routes to login.html"
);

assert(
    superAdminSource.includes('document.getElementById("logoutBtn")'),
    "Super Admin dashboard has a logout button handler"
);

assert(
    superAdminSource.includes('addEventListener("click"'),
    "Super Admin logout button registers a click handler"
);

/* =========================================
   COOPERATIVE ADMIN SESSION TERMINATION
   ========================================= */

const cooperativeAdminSource = fs.readFileSync(
    "js/cooperative-admin.js",
    "utf8"
);

assert(
    cooperativeAdminSource.includes("signOut(auth)"),
    "Cooperative Admin dashboard uses Firebase signOut"
);

assert(
    cooperativeAdminSource.includes('window.location.href ='),
    "Cooperative Admin session termination performs navigation"
);

assert(
    cooperativeAdminSource.includes('"login.html"'),
    "Cooperative Admin logout routes to login.html"
);

assert(
    cooperativeAdminSource.includes("logoutBtn"),
    "Cooperative Admin dashboard has a logout button handler"
);

assert(
    cooperativeAdminSource.includes('addEventListener('),
    "Cooperative Admin logout button registers an event handler"
);

/* =========================================
   INVALID SESSION PROTECTION
   ========================================= */

assert(
    superAdminSource.includes(
        'if (!user)'
    ),
    "Super Admin dashboard rejects missing Firebase sessions"
);

assert(
    cooperativeAdminSource.includes(
        'if (!user)'
    ),
    "Cooperative Admin dashboard rejects missing Firebase sessions"
);

assert(
    superAdminSource.includes(
        'if (!userDoc.exists())'
    ),
    "Super Admin dashboard rejects missing user profiles"
);

assert(
    cooperativeAdminSource.includes(
        'if (!userDoc.exists())'
    ),
    "Cooperative Admin dashboard rejects missing user profiles"
);

/* =========================================
   INVALID SESSION TERMINATION
   ========================================= */

assert(
    superAdminSource.includes(
        'await signOut(auth);'
    ),
    "Super Admin invalid sessions are explicitly terminated"
);

assert(
    cooperativeAdminSource.includes(
        'await signOut(auth);'
    ),
    "Cooperative Admin invalid sessions are explicitly terminated"
);

/* =========================================
   ROLE BOUNDARY AFTER SESSION VALIDATION
   ========================================= */

assert(
    superAdminSource.includes(
        'rolesMatch(userData.role, "super_admin")'
    ),
    "Super Admin dashboard validates canonical Super Admin role"
);

assert(
    cooperativeAdminSource.includes(
        'rolesMatch(userData.role, "cooperative_admin")'
    ),
    "Cooperative Admin dashboard validates canonical Cooperative Admin role"
);

/* =========================================
   ROLE ALIAS COMPATIBILITY
   ========================================= */

assert(
    normalizeRole("superAdmin") === "super_admin",
    "Legacy superAdmin remains compatible with logout authorization"
);

assert(
    normalizeRole("cooperativeAdmin") === "cooperative_admin",
    "Legacy cooperativeAdmin remains compatible with logout authorization"
);

/* =========================================
   ROLE ISOLATION
   ========================================= */

assert(
    rolesMatch("superAdmin", "super_admin"),
    "Super Admin alias remains valid for Super Admin"
);

assert(
    rolesMatch("cooperativeAdmin", "cooperative_admin"),
    "Cooperative Admin alias remains valid for Cooperative Admin"
);

assert(
    !rolesMatch("cooperative_admin", "super_admin"),
    "Cooperative Admin cannot cross Super Admin session boundary"
);

assert(
    !rolesMatch("super_admin", "cooperative_admin"),
    "Super Admin cannot cross Cooperative Admin session boundary"
);

assert(
    !rolesMatch("member", "super_admin"),
    "Member cannot cross Super Admin session boundary"
);

assert(
    !rolesMatch("member", "cooperative_admin"),
    "Member cannot cross Cooperative Admin session boundary"
);

assert(
    !rolesMatch("unknown", "super_admin"),
    "Unknown role cannot cross Super Admin session boundary"
);

assert(
    !rolesMatch("unknown", "cooperative_admin"),
    "Unknown role cannot cross Cooperative Admin session boundary"
);

assert(
    !rolesMatch(null, "super_admin"),
    "Missing role cannot cross Super Admin session boundary"
);

assert(
    !rolesMatch(null, "cooperative_admin"),
    "Missing role cannot cross Cooperative Admin session boundary"
);

/* =========================================
   FINAL RESULT
   ========================================= */

console.log("=========================================");

if (failed) {
    console.log(
        "RC131 LOGOUT & SESSION TERMINATION INTEGRATION TEST: FAIL"
    );

    process.exitCode = 1;
} else {
    console.log(
        "RC131 LOGOUT & SESSION TERMINATION INTEGRATION TEST: PASS"
    );
}

console.log("=========================================");
`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC131 - LOGOUT & SESSION TERMINATION INTEGRATION");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC131 TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC131 PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC131 PATCH COMPLETE");
    console.log("=========================================");
}

run();
