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
    superAdminSource.includes("onAuthStateChanged"),
    "Super Admin authentication guard remains active"
);

check(
    cooperativeAdminSource.includes("onAuthStateChanged"),
    "Cooperative Admin authentication guard remains active"
);

check(
    superAdminSource.includes("auth.currentUser"),
    "Super Admin remains bound to the current authenticated user"
);

check(
    cooperativeAdminSource.includes("auth.currentUser"),
    "Cooperative Admin remains bound to the current authenticated user"
);

check(
    superAdminSource.includes('doc(db, "users", currentUser.uid)'),
    "Super Admin remains bound to the current Firestore profile"
);

check(
    cooperativeAdminSource.includes('doc(db, "users", currentUser.uid)'),
    "Cooperative Admin remains bound to the current Firestore profile"
);

check(
    roleSource.includes("normalizeRole") &&
    roleSource.includes("rolesMatch"),
    "Canonical authorization layer remains intact"
);

check(
    superAdminSource.includes("rolesMatch(") &&
    superAdminSource.includes('"super_admin"'),
    "Super Admin canonical authorization remains intact"
);

check(
    cooperativeAdminSource.includes("rolesMatch(") &&
    cooperativeAdminSource.includes('"cooperative_admin"'),
    "Cooperative Admin canonical authorization remains intact"
);

check(
    superAdminSource.includes("signOut") &&
    cooperativeAdminSource.includes("signOut"),
    "Protected dashboards retain session termination"
);

check(
    superAdminSource.includes("login.html") &&
    cooperativeAdminSource.includes("login.html"),
    "Protected dashboards retain login fallback"
);

check(
    superAdminSource.includes("cooperative-admin.html"),
    "Super Admin retains Cooperative Admin redirect boundary"
);

check(
    cooperativeAdminSource.includes("super-admin.html"),
    "Cooperative Admin retains Super Admin redirect boundary"
);

check(
    superAdminSource.includes("popstate") &&
    superAdminSource.includes("pageshow") &&
    superAdminSource.includes("visibilitychange"),
    "Super Admin retains browser history re-entry protection"
);

check(
    cooperativeAdminSource.includes("popstate") &&
    cooperativeAdminSource.includes("pageshow") &&
    cooperativeAdminSource.includes("visibilitychange"),
    "Cooperative Admin retains browser history re-entry protection"
);

console.log("=========================================");

if (failed) {
    console.log(
        "RC152 PROTECTED DASHBOARD AUTHORIZATION REGRESSION TEST: FAIL"
    );
    process.exitCode = 1;
} else {
    console.log(
        "RC152 PROTECTED DASHBOARD AUTHORIZATION REGRESSION TEST: PASS"
    );
}

console.log("=========================================");
