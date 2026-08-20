import fs from "fs";

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
    "Both protected dashboards retain authentication monitoring"
);

check(
    superAdminSource.includes("auth.currentUser") &&
    cooperativeAdminSource.includes("auth.currentUser"),
    "Both protected dashboards remain bound to the Firebase user"
);

check(
    superAdminSource.includes('doc(db, "users", user.uid)') &&
    cooperativeAdminSource.includes('doc(db, "users", user.uid)'),
    "Both protected dashboards remain bound to the Firestore profile"
);

check(
    roleSource.includes("normalizeRole") &&
    roleSource.includes("rolesMatch"),
    "Canonical authorization primitives remain intact"
);

check(
    superAdminSource.includes("rolesMatch(") &&
    superAdminSource.includes('"super_admin"'),
    "Super Admin retains canonical authorization"
);

check(
    cooperativeAdminSource.includes("rolesMatch(") &&
    cooperativeAdminSource.includes('"cooperative_admin"'),
    "Cooperative Admin retains canonical authorization"
);

check(
    superAdminSource.includes("signOut") &&
    cooperativeAdminSource.includes("signOut"),
    "Protected sessions retain termination capability"
);

check(
    superAdminSource.includes("login.html") &&
    cooperativeAdminSource.includes("login.html"),
    "Protected dashboards retain login fallback"
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
    console.log(
        "RC155 PROTECTED DASHBOARD AUTHORIZATION CLOSURE VERIFICATION TEST: FAIL"
    );
    process.exitCode = 1;
} else {
    console.log(
        "RC155 PROTECTED DASHBOARD AUTHORIZATION CLOSURE VERIFICATION TEST: PASS"
    );
}

console.log("=========================================");
