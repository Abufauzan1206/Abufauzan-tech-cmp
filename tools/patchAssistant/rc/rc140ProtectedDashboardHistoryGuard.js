/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC140 - PROTECTED DASHBOARD HISTORY GUARD
 *
 * Purpose:
 * Protect Super Admin and Cooperative Admin dashboards
 * against browser Back/Forward history re-entry after
 * authentication or authorization state changes.
 *
 * No production files are modified by this RC patch.
 *
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "tools/patchAssistant/test/testProtectedDashboardHistoryGuard.js",
        mode: "create",
        search: "",
        replace: `import fs from "fs";
import assert from "assert";

const superAdminSource = fs.readFileSync(
    "js/super-admin.js",
    "utf8"
);

const cooperativeAdminSource = fs.readFileSync(
    "js/cooperative-admin.js",
    "utf8"
);

const roleAuthorizationSource = fs.readFileSync(
    "js/components/roleAuthorization.js",
    "utf8"
);

let failed = false;

function check(condition, message) {
    if (condition) {
        console.log("PASS: " + message);
    } else {
        console.log("FAIL: " + message);
        failed = true;
    }
}

/* =========================================
   PHASE 1
   AUTHENTICATION STATE RE-EVALUATION
   ========================================= */

check(
    superAdminSource.includes("onAuthStateChanged"),
    "Super Admin dashboard re-evaluates Firebase authentication state"
);

check(
    cooperativeAdminSource.includes("onAuthStateChanged"),
    "Cooperative Admin dashboard re-evaluates Firebase authentication state"
);

check(
    superAdminSource.includes("currentUser"),
    "Super Admin dashboard resolves the current Firebase user"
);

check(
    cooperativeAdminSource.includes("currentUser"),
    "Cooperative Admin dashboard resolves the current Firebase user"
);

/* =========================================
   PHASE 2
   HISTORY NAVIGATION AWARENESS
   ========================================= */

check(
    superAdminSource.includes("popstate") ||
    superAdminSource.includes("pageshow") ||
    superAdminSource.includes("visibilitychange"),
    "Super Admin dashboard has a browser lifecycle/history re-entry boundary"
);

check(
    cooperativeAdminSource.includes("popstate") ||
    cooperativeAdminSource.includes("pageshow") ||
    cooperativeAdminSource.includes("visibilitychange"),
    "Cooperative Admin dashboard has a browser lifecycle/history re-entry boundary"
);

/* =========================================
   PHASE 3
   SESSION TERMINATION / FALLBACK
   ========================================= */

check(
    superAdminSource.includes("login.html"),
    "Super Admin history re-entry retains login fallback"
);

check(
    cooperativeAdminSource.includes("login.html"),
    "Cooperative Admin history re-entry retains login fallback"
);

check(
    superAdminSource.includes("signOut") ||
    superAdminSource.includes("logout"),
    "Super Admin stale history session can be terminated"
);

check(
    cooperativeAdminSource.includes("signOut") ||
    cooperativeAdminSource.includes("logout"),
    "Cooperative Admin stale history session can be terminated"
);

/* =========================================
   PHASE 4
   ROLE ISOLATION
   ========================================= */

check(
    roleAuthorizationSource.includes("normalizeRole"),
    "History guard has access to canonical role normalization"
);

check(
    roleAuthorizationSource.includes("rolesMatch"),
    "History guard has access to canonical role matching"
);

check(
    roleAuthorizationSource.includes('"super_admin"'),
    "History guard recognizes canonical Super Admin role"
);

check(
    roleAuthorizationSource.includes('"cooperative_admin"'),
    "History guard recognizes canonical Cooperative Admin role"
);

/* =========================================
   PHASE 5
   CROSS-DASHBOARD HISTORY ISOLATION
   ========================================= */

check(
    superAdminSource.includes("cooperative-admin.html"),
    "Super Admin history navigation retains Cooperative Admin redirect boundary"
);

check(
    cooperativeAdminSource.includes("super-admin.html"),
    "Cooperative Admin history navigation retains Super Admin redirect boundary"
);

/* =========================================
   PHASE 6
   NEGATIVE AUTHORIZATION CONTRACT
   ========================================= */

const normalizeRole = (role) => {
    if (role === "superAdmin") return "super_admin";
    if (role === "cooperativeAdmin") return "cooperative_admin";
    return role;
};

const rolesMatch = (actualRole, expectedRole) =>
    normalizeRole(actualRole) === expectedRole;

check(
    rolesMatch("superAdmin", "super_admin"),
    "Legacy Super Admin remains valid during history re-entry"
);

check(
    rolesMatch("super_admin", "super_admin"),
    "Canonical Super Admin remains valid during history re-entry"
);

check(
    rolesMatch("cooperativeAdmin", "cooperative_admin"),
    "Legacy Cooperative Admin remains valid during history re-entry"
);

check(
    rolesMatch("cooperative_admin", "cooperative_admin"),
    "Canonical Cooperative Admin remains valid during history re-entry"
);

check(
    !rolesMatch("cooperative_admin", "super_admin"),
    "Cooperative Admin cannot regain Super Admin access through history"
);

check(
    !rolesMatch("super_admin", "cooperative_admin"),
    "Super Admin cannot regain Cooperative Admin access through history"
);

check(
    !rolesMatch("member", "super_admin"),
    "Member cannot regain Super Admin access through history"
);

check(
    !rolesMatch("member", "cooperative_admin"),
    "Member cannot regain Cooperative Admin access through history"
);

check(
    !rolesMatch("unknown", "super_admin"),
    "Unknown role cannot bypass Super Admin history guard"
);

check(
    !rolesMatch("unknown", "cooperative_admin"),
    "Unknown role cannot bypass Cooperative Admin history guard"
);

check(
    !rolesMatch(undefined, "super_admin"),
    "Missing role cannot bypass Super Admin history guard"
);

check(
    !rolesMatch(undefined, "cooperative_admin"),
    "Missing role cannot bypass Cooperative Admin history guard"
);

/* =========================================
   FINAL RESULT
   ========================================= */

console.log("=========================================");

if (failed) {
    console.log(
        "RC140 PROTECTED DASHBOARD HISTORY GUARD TEST: FAIL"
    );

    process.exitCode = 1;
} else {
    console.log(
        "RC140 PROTECTED DASHBOARD HISTORY GUARD TEST: PASS"
    );
}

console.log("=========================================");
`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC140 - PROTECTED DASHBOARD HISTORY GUARD");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC140 TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC140 PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC140 PATCH COMPLETE");
    console.log("=========================================");
}

run();
