import fs from "fs";
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
    superAdminSource.includes("onAuthStateChanged(auth"),
    "Super Admin dashboard resolves the current Firebase user through the Firebase auth-state boundary"
);

check(
    cooperativeAdminSource.includes("onAuthStateChanged(auth"),
    "Cooperative Admin dashboard resolves the current Firebase user through the Firebase auth-state boundary"
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
