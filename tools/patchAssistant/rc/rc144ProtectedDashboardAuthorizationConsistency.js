/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC144 - PROTECTED DASHBOARD AUTHORIZATION CONSISTENCY
 *
 * Purpose:
 * Verify that protected dashboards consistently enforce
 * authentication, Firestore profile resolution,
 * canonical role authorization, redirect boundaries,
 * and session termination.
 *
 * Production files are not modified by this RC.
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "tools/patchAssistant/test/testProtectedDashboardAuthorizationConsistency.js",
        mode: "create",
        search: "",
        replace: `import fs from "fs";
import {
    normalizeRole,
    rolesMatch
} from "../../../js/components/roleAuthorization.js";

console.log("=========================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC144 - PROTECTED DASHBOARD AUTHORIZATION CONSISTENCY TEST");
console.log("=========================================");

let failed = false;

function check(condition, message) {
    if (condition) {
        console.log("PASS:", message);
    } else {
        console.log("FAIL:", message);
        failed = true;
    }
}

const superAdminSource = fs.readFileSync(
    "js/super-admin.js",
    "utf8"
);

const cooperativeAdminSource = fs.readFileSync(
    "js/cooperative-admin.js",
    "utf8"
);

const roleSource = fs.readFileSync(
    "js/components/roleAuthorization.js",
    "utf8"
);

/* =========================================
   PHASE 1
   AUTHENTICATION CONSISTENCY
   ========================================= */

check(
    superAdminSource.includes("onAuthStateChanged"),
    "Super Admin dashboard consistently observes authentication state"
);

check(
    cooperativeAdminSource.includes("onAuthStateChanged"),
    "Cooperative Admin dashboard consistently observes authentication state"
);

check(
    superAdminSource.includes("auth.currentUser"),
    "Super Admin dashboard consistently resolves the current authenticated user"
);

check(
    cooperativeAdminSource.includes("auth.currentUser"),
    "Cooperative Admin dashboard consistently resolves the current authenticated user"
);

/* =========================================
   PHASE 2
   FIRESTORE AUTHORIZATION CONSISTENCY
   ========================================= */

check(
    superAdminSource.includes('doc(db, "users", user.uid)'),
    "Super Admin dashboard consistently resolves the Firestore user profile"
);

check(
    cooperativeAdminSource.includes('doc(db, "users", user.uid)'),
    "Cooperative Admin dashboard consistently resolves the Firestore user profile"
);

check(
    superAdminSource.includes("userDoc.exists()"),
    "Super Admin dashboard validates Firestore profile existence"
);

check(
    cooperativeAdminSource.includes("userDoc.exists()"),
    "Cooperative Admin dashboard validates Firestore profile existence"
);

check(
    superAdminSource.includes("userDoc.data()"),
    "Super Admin dashboard consistently reads authorization data"
);

check(
    cooperativeAdminSource.includes("userDoc.data()"),
    "Cooperative Admin dashboard consistently reads authorization data"
);

/* =========================================
   PHASE 3
   CANONICAL ROLE CONSISTENCY
   ========================================= */

check(
    roleSource.includes("normalizeRole"),
    "Authorization layer exposes canonical role normalization"
);

check(
    roleSource.includes("rolesMatch"),
    "Authorization layer exposes canonical role matching"
);

check(
    rolesMatch("superAdmin", "super_admin"),
    "Legacy Super Admin role maps consistently to canonical authorization"
);

check(
    rolesMatch("super_admin", "super_admin"),
    "Canonical Super Admin role matches consistently"
);

check(
    rolesMatch("cooperativeAdmin", "cooperative_admin"),
    "Legacy Cooperative Admin role maps consistently to canonical authorization"
);

check(
    rolesMatch("cooperative_admin", "cooperative_admin"),
    "Canonical Cooperative Admin role matches consistently"
);

/* =========================================
   PHASE 4
   CROSS-ROLE ISOLATION
   ========================================= */

check(
    !rolesMatch("cooperative_admin", "super_admin"),
    "Cooperative Admin cannot satisfy Super Admin authorization"
);

check(
    !rolesMatch("super_admin", "cooperative_admin"),
    "Super Admin cannot satisfy Cooperative Admin authorization"
);

check(
    !rolesMatch("member", "super_admin"),
    "Member cannot satisfy Super Admin authorization"
);

check(
    !rolesMatch("member", "cooperative_admin"),
    "Member cannot satisfy Cooperative Admin authorization"
);

check(
    !rolesMatch("unknown", "super_admin"),
    "Unknown role cannot satisfy Super Admin authorization"
);

check(
    !rolesMatch("unknown", "cooperative_admin"),
    "Unknown role cannot satisfy Cooperative Admin authorization"
);

check(
    !rolesMatch(undefined, "super_admin"),
    "Missing role cannot satisfy Super Admin authorization"
);

check(
    !rolesMatch(undefined, "cooperative_admin"),
    "Missing role cannot satisfy Cooperative Admin authorization"
);

/* =========================================
   PHASE 5
   REDIRECT CONSISTENCY
   ========================================= */

check(
    superAdminSource.includes("cooperative-admin.html"),
    "Super Admin dashboard consistently preserves Cooperative Admin redirect boundary"
);

check(
    cooperativeAdminSource.includes("super-admin.html"),
    "Cooperative Admin dashboard consistently preserves Super Admin redirect boundary"
);

check(
    superAdminSource.includes("login.html"),
    "Super Admin dashboard consistently preserves login fallback"
);

check(
    cooperativeAdminSource.includes("login.html"),
    "Cooperative Admin dashboard consistently preserves login fallback"
);

/* =========================================
   PHASE 6
   SESSION TERMINATION CONSISTENCY
   ========================================= */

check(
    superAdminSource.includes("signOut"),
    "Super Admin dashboard consistently supports session termination"
);

check(
    cooperativeAdminSource.includes("signOut"),
    "Cooperative Admin dashboard consistently supports session termination"
);

/* =========================================
   PHASE 7
   HISTORY / RE-ENTRY CONSISTENCY
   ========================================= */

check(
    superAdminSource.includes("popstate") ||
    superAdminSource.includes("pageshow") ||
    superAdminSource.includes("visibilitychange"),
    "Super Admin dashboard consistently protects browser history re-entry"
);

check(
    cooperativeAdminSource.includes("popstate") ||
    cooperativeAdminSource.includes("pageshow") ||
    cooperativeAdminSource.includes("visibilitychange"),
    "Cooperative Admin dashboard consistently protects browser history re-entry"
);

/* =========================================
   FINAL RESULT
   ========================================= */

console.log("=========================================");

if (failed) {
    console.log(
        "RC144 PROTECTED DASHBOARD AUTHORIZATION CONSISTENCY TEST: FAIL"
    );

    process.exitCode = 1;
} else {
    console.log(
        "RC144 PROTECTED DASHBOARD AUTHORIZATION CONSISTENCY TEST: PASS"
    );
}

console.log("=========================================");
`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC144 - PROTECTED DASHBOARD AUTHORIZATION CONSISTENCY");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC144 TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC144 PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC144 PATCH COMPLETE");
    console.log("=========================================");

    console.log("Running RC144 test...");
    console.log("=========================================");

    const { spawnSync } = await import("child_process");

    const test = spawnSync(
        "node",
        [
            "tools/patchAssistant/test/testProtectedDashboardAuthorizationConsistency.js"
        ],
        {
            stdio: "inherit"
        }
    );

    process.exitCode = test.status ?? 1;
}

run();
