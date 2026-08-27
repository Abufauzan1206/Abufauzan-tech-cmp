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
    "Protected dashboards retain Firebase authentication monitoring"
);

check(
    superAdminSource.includes("auth.currentUser") &&
    cooperativeAdminSource.includes("auth.currentUser"),
    "Protected dashboards remain bound to the authenticated Firebase user"
);

check(
    superAdminSource.includes('doc(db, "users", currentUser.uid)') &&
    cooperativeAdminSource.includes('doc(db, "users", currentUser.uid)'),
    "Protected dashboards remain bound to the current Firestore profile"
);

check(
    roleSource.includes("normalizeRole") &&
    roleSource.includes("rolesMatch"),
    "Canonical authorization primitives remain intact"
);

check(
    superAdminSource.includes("rolesMatch(") &&
    superAdminSource.includes('"super_admin"'),
    "Super Admin authorization remains explicitly role-bound"
);

check(
    cooperativeAdminSource.includes("rolesMatch(") &&
    cooperativeAdminSource.includes('"cooperative_admin"'),
    "Cooperative Admin authorization remains explicitly role-bound"
);

check(
    superAdminSource.includes("signOut") &&
    cooperativeAdminSource.includes("signOut"),
    "Protected sessions retain explicit termination"
);

check(
    superAdminSource.includes("login.html") &&
    cooperativeAdminSource.includes("login.html"),
    "Unauthorized access retains login fallback"
);

check(
    superAdminSource.includes("cooperative-admin.html"),
    "Super Admin retains the Cooperative Admin boundary"
);

check(
    cooperativeAdminSource.includes("super-admin.html"),
    "Cooperative Admin retains the Super Admin boundary"
);

check(
    superAdminSource.includes("popstate") &&
    superAdminSource.includes("pageshow") &&
    superAdminSource.includes("visibilitychange"),
    "Super Admin retains complete browser re-entry protection"
);

check(
    cooperativeAdminSource.includes("popstate") &&
    cooperativeAdminSource.includes("pageshow") &&
    cooperativeAdminSource.includes("visibilitychange"),
    "Cooperative Admin retains complete browser re-entry protection"
);

console.log("=========================================");

if (failed) {
    console.log(
        "RC154 PROTECTED DASHBOARD AUTHORIZATION FINAL VERIFICATION: FAIL"
    );
    process.exitCode = 1;
} else {
    console.log(
        "RC154 PROTECTED DASHBOARD AUTHORIZATION FINAL VERIFICATION: PASS"
    );
}

console.log("=========================================");
