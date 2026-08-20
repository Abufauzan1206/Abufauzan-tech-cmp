import fs from "fs";

const superAdminSource = fs.readFileSync("js/super-admin.js", "utf8");
const cooperativeAdminSource = fs.readFileSync("js/cooperative-admin.js", "utf8");
const roleSource = fs.readFileSync("js/components/roleAuthorization.js", "utf8");

let failed = false;

function check(condition, message) {
    if (condition) {
        console.log("PASS: " + message);
    } else {
        console.log("FAIL: " + message);
        failed = true;
    }
}

check(
    superAdminSource.includes("onAuthStateChanged") &&
    cooperativeAdminSource.includes("onAuthStateChanged"),
    "Authentication guards remain active on both protected dashboards"
);

check(
    superAdminSource.includes("auth.currentUser") &&
    cooperativeAdminSource.includes("auth.currentUser"),
    "Both dashboards remain bound to the active Firebase user"
);

check(
    superAdminSource.includes("rolesMatch") &&
    cooperativeAdminSource.includes("rolesMatch"),
    "Canonical role authorization remains intact"
);

check(
    roleSource.includes("normalizeRole") &&
    roleSource.includes("rolesMatch"),
    "Canonical authorization primitives remain intact"
);

check(
    superAdminSource.includes("signOut") &&
    cooperativeAdminSource.includes("signOut"),
    "Protected session termination remains available"
);

check(
    superAdminSource.includes("login.html") &&
    cooperativeAdminSource.includes("login.html"),
    "Login fallback remains available"
);

check(
    superAdminSource.includes("cooperative-admin.html"),
    "Super Admin retains Cooperative Admin boundary"
);

check(
    cooperativeAdminSource.includes("super-admin.html"),
    "Cooperative Admin retains Super Admin boundary"
);

check(
    superAdminSource.includes("popstate") &&
    superAdminSource.includes("pageshow") &&
    superAdminSource.includes("visibilitychange"),
    "Super Admin retains browser re-entry protection"
);

check(
    cooperativeAdminSource.includes("popstate") &&
    cooperativeAdminSource.includes("pageshow") &&
    cooperativeAdminSource.includes("visibilitychange"),
    "Cooperative Admin retains browser re-entry protection"
);

console.log("=========================================");

if (failed) {
    console.log("RC156 PROTECTED DASHBOARD AUTHORIZATION REGRESSION VERIFICATION TEST: FAIL");
    process.exitCode = 1;
} else {
    console.log("RC156 PROTECTED DASHBOARD AUTHORIZATION REGRESSION VERIFICATION TEST: PASS");
}

console.log("=========================================");
