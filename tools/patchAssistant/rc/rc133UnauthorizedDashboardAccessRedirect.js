/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC133 - UNAUTHORIZED DASHBOARD ACCESS & REDIRECT
 *         INTEGRATION
 *
 * Purpose:
 * 1. Verify protected dashboards redirect missing sessions.
 * 2. Verify missing profiles are rejected.
 * 3. Verify unauthorized roles are redirected safely.
 * 4. Verify Super Admin is redirected to its dashboard.
 * 5. Verify Cooperative Admin is redirected to its dashboard.
 * 6. Verify cross-dashboard access remains isolated.
 * 7. Verify unknown and missing roles cannot bypass guards.
 *
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "tools/patchAssistant/test/testUnauthorizedDashboardAccessRedirect.js",
        mode: "create",
        search: "",
        replace: `/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC133 - UNAUTHORIZED DASHBOARD ACCESS & REDIRECT TEST
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
console.log("RC133 - UNAUTHORIZED DASHBOARD ACCESS & REDIRECT TEST");
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
   LOAD PROTECTED DASHBOARD SOURCES
   ========================================= */

const superAdminSource = fs.readFileSync(
    "js/super-admin.js",
    "utf8"
);

const cooperativeAdminSource = fs.readFileSync(
    "js/cooperative-admin.js",
    "utf8"
);

/* =========================================
   SUPER ADMIN - MISSING SESSION
   ========================================= */

assert(
    superAdminSource.includes("if (!user)"),
    "Super Admin dashboard checks for missing Firebase session"
);

assert(
    superAdminSource.includes('window.location.href = "login.html"'),
    "Super Admin missing session redirects to login.html"
);

/* =========================================
   COOPERATIVE ADMIN - MISSING SESSION
   ========================================= */

assert(
    cooperativeAdminSource.includes("if (!user)"),
    "Cooperative Admin dashboard checks for missing Firebase session"
);

assert(
    cooperativeAdminSource.includes('window.location.href = "login.html"'),
    "Cooperative Admin missing session redirects to login.html"
);

/* =========================================
   SUPER ADMIN - MISSING PROFILE
   ========================================= */

assert(
    superAdminSource.includes("!userDoc.exists()"),
    "Super Admin dashboard detects missing Firestore profile"
);

assert(
    superAdminSource.includes("await signOut(auth)"),
    "Super Admin invalid session is terminated"
);

/* =========================================
   COOPERATIVE ADMIN - MISSING PROFILE
   ========================================= */

assert(
    cooperativeAdminSource.includes("!userDoc.exists()"),
    "Cooperative Admin dashboard detects missing Firestore profile"
);

assert(
    cooperativeAdminSource.includes("await signOut(auth)"),
    "Cooperative Admin invalid session is terminated"
);

/* =========================================
   SUPER ADMIN ROLE GUARD
   ========================================= */

assert(
    superAdminSource.includes("rolesMatch"),
    "Super Admin dashboard uses canonical role authorization"
);

assert(
    superAdminSource.includes('"super_admin"'),
    "Super Admin dashboard checks canonical super_admin role"
);

assert(
    superAdminSource.includes('"cooperative_admin"'),
    "Super Admin dashboard recognizes Cooperative Admin redirection"
);

assert(
    superAdminSource.includes('"cooperative-admin.html"'),
    "Super Admin dashboard redirects Cooperative Admin to cooperative-admin.html"
);

assert(
    superAdminSource.includes('"login.html"'),
    "Super Admin dashboard redirects unauthorized roles to login.html"
);

/* =========================================
   COOPERATIVE ADMIN ROLE GUARD
   ========================================= */

assert(
    cooperativeAdminSource.includes("rolesMatch"),
    "Cooperative Admin dashboard uses canonical role authorization"
);

assert(
    cooperativeAdminSource.includes('"cooperative_admin"'),
    "Cooperative Admin dashboard checks canonical cooperative_admin role"
);

assert(
    cooperativeAdminSource.includes('"super_admin"'),
    "Cooperative Admin dashboard recognizes Super Admin redirection"
);

assert(
    cooperativeAdminSource.includes('"super-admin.html"'),
    "Cooperative Admin dashboard redirects Super Admin to super-admin.html"
);

assert(
    cooperativeAdminSource.includes('"login.html"'),
    "Cooperative Admin dashboard redirects unauthorized roles to login.html"
);

/* =========================================
   SUPER ADMIN ROUTING MATRIX
   ========================================= */

assert(
    rolesMatch("superAdmin", "super_admin"),
    "Legacy superAdmin is accepted by Super Admin guard"
);

assert(
    rolesMatch("super_admin", "super_admin"),
    "Canonical super_admin is accepted by Super Admin guard"
);

assert(
    !rolesMatch("cooperativeAdmin", "super_admin"),
    "Legacy cooperativeAdmin is rejected by Super Admin guard"
);

assert(
    !rolesMatch("cooperative_admin", "super_admin"),
    "Canonical cooperative_admin is rejected by Super Admin guard"
);

assert(
    !rolesMatch("member", "super_admin"),
    "Member is rejected by Super Admin guard"
);

/* =========================================
   COOPERATIVE ADMIN ROUTING MATRIX
   ========================================= */

assert(
    rolesMatch("cooperativeAdmin", "cooperative_admin"),
    "Legacy cooperativeAdmin is accepted by Cooperative Admin guard"
);

assert(
    rolesMatch("cooperative_admin", "cooperative_admin"),
    "Canonical cooperative_admin is accepted by Cooperative Admin guard"
);

assert(
    !rolesMatch("superAdmin", "cooperative_admin"),
    "Legacy superAdmin is rejected by Cooperative Admin guard"
);

assert(
    !rolesMatch("super_admin", "cooperative_admin"),
    "Canonical super_admin is rejected by Cooperative Admin guard"
);

assert(
    !rolesMatch("member", "cooperative_admin"),
    "Member is rejected by Cooperative Admin guard"
);

/* =========================================
   UNKNOWN / MISSING ROLES
   ========================================= */

assert(
    !rolesMatch("unknown", "super_admin"),
    "Unknown role cannot bypass Super Admin redirect guard"
);

assert(
    !rolesMatch("unknown", "cooperative_admin"),
    "Unknown role cannot bypass Cooperative Admin redirect guard"
);

assert(
    !rolesMatch(null, "super_admin"),
    "Missing role cannot bypass Super Admin redirect guard"
);

assert(
    !rolesMatch(null, "cooperative_admin"),
    "Missing role cannot bypass Cooperative Admin redirect guard"
);

/* =========================================
   ROLE NORMALIZATION
   ========================================= */

assert(
    normalizeRole("superAdmin") === "super_admin",
    "superAdmin normalizes to canonical super_admin"
);

assert(
    normalizeRole("cooperativeAdmin") === "cooperative_admin",
    "cooperativeAdmin normalizes to canonical cooperative_admin"
);

/* =========================================
   FINAL RESULT
   ========================================= */

console.log("=========================================");

if (failed) {
    console.log(
        "RC133 UNAUTHORIZED DASHBOARD ACCESS & REDIRECT TEST: FAIL"
    );

    process.exitCode = 1;
} else {
    console.log(
        "RC133 UNAUTHORIZED DASHBOARD ACCESS & REDIRECT TEST: PASS"
    );
}

console.log("=========================================");
`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC133 - UNAUTHORIZED DASHBOARD ACCESS & REDIRECT");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC133 TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC133 PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC133 PATCH COMPLETE");
    console.log("=========================================");
}

run();
