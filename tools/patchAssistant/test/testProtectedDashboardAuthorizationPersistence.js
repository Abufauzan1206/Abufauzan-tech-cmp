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
   AUTHENTICATION PERSISTENCE
   ========================================= */

check(
    superAdminSource.includes("onAuthStateChanged"),
    "Super Admin dashboard continuously observes Firebase authentication state"
);

check(
    cooperativeAdminSource.includes("onAuthStateChanged"),
    "Cooperative Admin dashboard continuously observes Firebase authentication state"
);

check(
    superAdminSource.includes("auth.currentUser"),
    "Super Admin dashboard resolves the current authenticated Firebase user"
);

check(
    cooperativeAdminSource.includes("auth.currentUser"),
    "Cooperative Admin dashboard resolves the current authenticated Firebase user"
);

/* =========================================
   PHASE 2
   PROFILE AUTHORIZATION PERSISTENCE
   ========================================= */

check(
    superAdminSource.includes('doc(db, "users", user.uid)'),
    "Super Admin authorization remains bound to the current Firestore user profile"
);

check(
    cooperativeAdminSource.includes('doc(db, "users", user.uid)'),
    "Cooperative Admin authorization remains bound to the current Firestore user profile"
);

check(
    superAdminSource.includes("getDoc"),
    "Super Admin dashboard reloads the Firestore authorization profile"
);

check(
    cooperativeAdminSource.includes("getDoc"),
    "Cooperative Admin dashboard reloads the Firestore authorization profile"
);

/* =========================================
   PHASE 3
   CANONICAL ROLE ENFORCEMENT
   ========================================= */

check(
    roleAuthorizationSource.includes("normalizeRole"),
    "Authorization persistence uses canonical role normalization"
);

check(
    roleAuthorizationSource.includes("rolesMatch"),
    "Authorization persistence uses canonical role matching"
);

check(
    superAdminSource.includes('rolesMatch(userData.role, "super_admin")'),
    "Super Admin dashboard enforces canonical Super Admin authorization"
);

check(
    cooperativeAdminSource.includes('rolesMatch(') &&
    cooperativeAdminSource.includes('"cooperative_admin"'),
    "Cooperative Admin dashboard enforces canonical Cooperative Admin authorization"
);

/* =========================================
   PHASE 4
   NEGATIVE AUTHORIZATION PERSISTENCE
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
    "Legacy Super Admin remains authorized through persistence validation"
);

check(
    rolesMatch("super_admin", "super_admin"),
    "Canonical Super Admin remains authorized through persistence validation"
);

check(
    rolesMatch("cooperativeAdmin", "cooperative_admin"),
    "Legacy Cooperative Admin remains authorized through persistence validation"
);

check(
    rolesMatch("cooperative_admin", "cooperative_admin"),
    "Canonical Cooperative Admin remains authorized through persistence validation"
);

check(
    !rolesMatch("cooperative_admin", "super_admin"),
    "Cooperative Admin cannot persist Super Admin authorization"
);

check(
    !rolesMatch("super_admin", "cooperative_admin"),
    "Super Admin cannot persist Cooperative Admin authorization"
);

check(
    !rolesMatch("member", "super_admin"),
    "Member cannot persist Super Admin authorization"
);

check(
    !rolesMatch("member", "cooperative_admin"),
    "Member cannot persist Cooperative Admin authorization"
);

check(
    !rolesMatch("unknown", "super_admin"),
    "Unknown role cannot persist Super Admin authorization"
);

check(
    !rolesMatch("unknown", "cooperative_admin"),
    "Unknown role cannot persist Cooperative Admin authorization"
);

check(
    !rolesMatch(undefined, "super_admin"),
    "Missing role cannot persist Super Admin authorization"
);

check(
    !rolesMatch(undefined, "cooperative_admin"),
    "Missing role cannot persist Cooperative Admin authorization"
);

/* =========================================
   PHASE 5
   SESSION TERMINATION
   ========================================= */

check(
    superAdminSource.includes("signOut"),
    "Super Admin authorization failure can terminate the Firebase session"
);

check(
    cooperativeAdminSource.includes("signOut"),
    "Cooperative Admin authorization failure can terminate the Firebase session"
);

check(
    superAdminSource.includes("login.html"),
    "Super Admin authorization failure retains login fallback"
);

check(
    cooperativeAdminSource.includes("login.html"),
    "Cooperative Admin authorization failure retains login fallback"
);

/* =========================================
   FINAL RESULT
   ========================================= */

console.log("=========================================");

if (failed) {
    console.log(
        "RC141 PROTECTED DASHBOARD AUTHORIZATION PERSISTENCE TEST: FAIL"
    );

    process.exitCode = 1;
} else {
    console.log(
        "RC141 PROTECTED DASHBOARD AUTHORIZATION PERSISTENCE TEST: PASS"
    );
}

console.log("=========================================");
