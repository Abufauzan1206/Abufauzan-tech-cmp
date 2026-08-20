/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC129 - AUTHENTICATION SESSION & DASHBOARD GUARD TEST
 *
 * =====================================================
 */

import {
    normalizeRole,
    rolesMatch
} from "../../../js/components/roleAuthorization.js";

console.log("=========================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC129 - AUTHENTICATION SESSION & DASHBOARD GUARD TEST");
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
   LOGIN ROLE NORMALIZATION
   ========================================= */

assert(
    normalizeRole("superAdmin") === "super_admin",
    "Login recognizes legacy superAdmin role"
);

assert(
    normalizeRole("super_admin") === "super_admin",
    "Login recognizes canonical super_admin role"
);

assert(
    normalizeRole("cooperativeAdmin") === "cooperative_admin",
    "Login recognizes legacy cooperativeAdmin role"
);

assert(
    normalizeRole("cooperative_admin") === "cooperative_admin",
    "Login recognizes canonical cooperative_admin role"
);

assert(
    normalizeRole("member") === "member",
    "Login preserves member role"
);

/* =========================================
   SUPER ADMIN DASHBOARD
   ========================================= */

assert(
    rolesMatch("superAdmin", "super_admin"),
    "superAdmin is authorized for Super Admin dashboard"
);

assert(
    rolesMatch("super_admin", "super_admin"),
    "super_admin is authorized for Super Admin dashboard"
);

assert(
    !rolesMatch("cooperativeAdmin", "super_admin"),
    "Cooperative Admin is rejected from Super Admin dashboard"
);

assert(
    !rolesMatch("cooperative_admin", "super_admin"),
    "cooperative_admin is rejected from Super Admin dashboard"
);

assert(
    !rolesMatch("member", "super_admin"),
    "Member is rejected from Super Admin dashboard"
);

/* =========================================
   COOPERATIVE ADMIN DASHBOARD
   ========================================= */

assert(
    rolesMatch("cooperativeAdmin", "cooperative_admin"),
    "cooperativeAdmin is authorized for Cooperative Admin dashboard"
);

assert(
    rolesMatch("cooperative_admin", "cooperative_admin"),
    "cooperative_admin is authorized for Cooperative Admin dashboard"
);

assert(
    !rolesMatch("superAdmin", "cooperative_admin"),
    "Super Admin is rejected from Cooperative Admin dashboard"
);

assert(
    !rolesMatch("super_admin", "cooperative_admin"),
    "super_admin is rejected from Cooperative Admin dashboard"
);

assert(
    !rolesMatch("member", "cooperative_admin"),
    "Member is rejected from Cooperative Admin dashboard"
);

/* =========================================
   UNKNOWN / INVALID ROLES
   ========================================= */

assert(
    !rolesMatch("unknown", "super_admin"),
    "Unknown role is rejected from Super Admin dashboard"
);

assert(
    !rolesMatch("unknown", "cooperative_admin"),
    "Unknown role is rejected from Cooperative Admin dashboard"
);

assert(
    !rolesMatch(null, "super_admin"),
    "Missing role is rejected from Super Admin dashboard"
);

assert(
    !rolesMatch(null, "cooperative_admin"),
    "Missing role is rejected from Cooperative Admin dashboard"
);

/* =========================================
   FINAL RESULT
   ========================================= */

console.log("=========================================");

if (failed) {

    console.log(
        "RC129 AUTHENTICATION SESSION & DASHBOARD GUARD TEST: FAIL"
    );

    process.exitCode = 1;

} else {

    console.log(
        "RC129 AUTHENTICATION SESSION & DASHBOARD GUARD TEST: PASS"
    );

}

console.log("=========================================");
