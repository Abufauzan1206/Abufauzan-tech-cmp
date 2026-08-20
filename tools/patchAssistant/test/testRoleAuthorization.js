/**
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
} from "../../../js/components/roleAuthorization.js";

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
