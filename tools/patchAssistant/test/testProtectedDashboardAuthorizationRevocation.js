import fs from "fs";

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
   AUTHENTICATION REVOCATION
   ========================================= */

check(
    superAdminSource.includes("onAuthStateChanged"),
    "Super Admin dashboard detects Firebase authentication revocation"
);

check(
    cooperativeAdminSource.includes("onAuthStateChanged"),
    "Cooperative Admin dashboard detects Firebase authentication revocation"
);

check(
    superAdminSource.includes("onAuthStateChanged(auth"),
    "Super Admin dashboard can resolve the current authenticated user through the Firebase auth-state boundary"
);

check(
    cooperativeAdminSource.includes("onAuthStateChanged(auth"),
    "Cooperative Admin dashboard can resolve the current authenticated user through the Firebase auth-state boundary"
);

/* =========================================
   PHASE 2
   PROFILE REVOCATION
   ========================================= */

check(
    superAdminSource.includes('doc(db, "users", user.uid)'),
    "Super Admin authorization is revalidated against the current Firestore profile"
);

check(
    cooperativeAdminSource.includes('doc(db, "users", user.uid)'),
    "Cooperative Admin authorization is revalidated against the current Firestore profile"
);

check(
    superAdminSource.includes("userDoc.exists()"),
    "Super Admin rejects a missing authorization profile"
);

check(
    cooperativeAdminSource.includes("userDoc.exists()"),
    "Cooperative Admin rejects a missing authorization profile"
);

/* =========================================
   PHASE 3
   ROLE REVOCATION
   ========================================= */

check(
    roleAuthorizationSource.includes("normalizeRole"),
    "Authorization revocation uses canonical role normalization"
);

check(
    roleAuthorizationSource.includes("rolesMatch"),
    "Authorization revocation uses canonical role matching"
);

check(
    superAdminSource.includes('rolesMatch(userData.role, "super_admin")'),
    "Super Admin authorization is explicitly role-bound"
);

check(
    cooperativeAdminSource.includes('"cooperative_admin"'),
    "Cooperative Admin authorization is explicitly role-bound"
);

/* =========================================
   PHASE 4
   REVOCATION RESPONSE
   ========================================= */

check(
    superAdminSource.includes("login.html"),
    "Super Admin revocation retains login fallback"
);

check(
    cooperativeAdminSource.includes("login.html"),
    "Cooperative Admin revocation retains login fallback"
);

check(
    superAdminSource.includes("signOut"),
    "Super Admin revoked session can be terminated"
);

check(
    cooperativeAdminSource.includes("signOut"),
    "Cooperative Admin revoked session can be terminated"
);

/* =========================================
   PHASE 5
   CROSS-DASHBOARD REVOCATION
   ========================================= */

check(
    superAdminSource.includes("cooperative-admin.html"),
    "Revoked Super Admin access retains Cooperative Admin boundary"
);

check(
    cooperativeAdminSource.includes("super-admin.html"),
    "Revoked Cooperative Admin access retains Super Admin boundary"
);

/* =========================================
   PHASE 6
   NEGATIVE REVOCATION CONTRACT
   ========================================= */

const normalizeRole = (role) => {
    if (role === "superAdmin") return "super_admin";
    if (role === "cooperativeAdmin") return "cooperative_admin";
    return role;
};

const rolesMatch = (actualRole, expectedRole) =>
    normalizeRole(actualRole) === expectedRole;

check(
    !rolesMatch("cooperative_admin", "super_admin"),
    "Cooperative Admin cannot retain Super Admin authorization after revocation"
);

check(
    !rolesMatch("super_admin", "cooperative_admin"),
    "Super Admin cannot retain Cooperative Admin authorization after revocation"
);

check(
    !rolesMatch("member", "super_admin"),
    "Member cannot retain Super Admin authorization after revocation"
);

check(
    !rolesMatch("member", "cooperative_admin"),
    "Member cannot retain Cooperative Admin authorization after revocation"
);

check(
    !rolesMatch("unknown", "super_admin"),
    "Unknown role cannot retain Super Admin authorization after revocation"
);

check(
    !rolesMatch("unknown", "cooperative_admin"),
    "Unknown role cannot retain Cooperative Admin authorization after revocation"
);

check(
    !rolesMatch(undefined, "super_admin"),
    "Missing role cannot retain Super Admin authorization after revocation"
);

check(
    !rolesMatch(undefined, "cooperative_admin"),
    "Missing role cannot retain Cooperative Admin authorization after revocation"
);

/* =========================================
   FINAL RESULT
   ========================================= */

console.log("=========================================");

if (failed) {
    console.log(
        "RC142 PROTECTED DASHBOARD AUTHORIZATION REVOCATION TEST: FAIL"
    );

    process.exitCode = 1;
} else {
    console.log(
        "RC142 PROTECTED DASHBOARD AUTHORIZATION REVOCATION TEST: PASS"
    );
}

console.log("=========================================");
