/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC128 - DASHBOARD ROLE AUTHORIZATION TEST
 *
 * =====================================================
 */

import {
    normalizeRole,
    rolesMatch
} from "../../../js/components/roleAuthorization.js";

console.log("=========================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC128 - DASHBOARD ROLE AUTHORIZATION TEST");
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

/* Super Admin */

assert(
    normalizeRole("superAdmin") === "super_admin",
    "superAdmin normalizes to super_admin"
);

assert(
    rolesMatch("superAdmin", "super_admin"),
    "superAdmin is authorized as super_admin"
);

assert(
    rolesMatch("super_admin", "superAdmin"),
    "super_admin matches superAdmin"
);

/* Cooperative Admin */

assert(
    normalizeRole("cooperativeAdmin") === "cooperative_admin",
    "cooperativeAdmin normalizes to cooperative_admin"
);

assert(
    rolesMatch("cooperativeAdmin", "cooperative_admin"),
    "cooperativeAdmin is authorized as cooperative_admin"
);

assert(
    rolesMatch("cooperative_admin", "cooperativeAdmin"),
    "cooperative_admin matches cooperativeAdmin"
);

/* Member */

assert(
    rolesMatch("member", "member"),
    "member matches member"
);

/* Cross-dashboard protection */

assert(
    !rolesMatch("member", "super_admin"),
    "member is rejected from super_admin dashboard"
);

assert(
    !rolesMatch("member", "cooperative_admin"),
    "member is rejected from cooperative_admin dashboard"
);

assert(
    !rolesMatch("cooperative_admin", "super_admin"),
    "cooperative_admin is rejected from super_admin dashboard"
);

assert(
    !rolesMatch("super_admin", "cooperative_admin"),
    "super_admin is rejected from cooperative_admin dashboard"
);

console.log("=========================================");

if (failed) {

    console.log(
        "RC128 DASHBOARD ROLE AUTHORIZATION TEST: FAIL"
    );

    console.log("=========================================");

    process.exitCode = 1;

} else {

    console.log(
        "RC128 DASHBOARD ROLE AUTHORIZATION TEST: PASS"
    );

    console.log("=========================================");
}
