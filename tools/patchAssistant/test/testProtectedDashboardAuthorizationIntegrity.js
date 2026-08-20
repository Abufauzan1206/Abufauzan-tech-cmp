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
    "Super Admin authentication integrity remains active"
);

check(
    cooperativeAdminSource.includes("onAuthStateChanged"),
    "Cooperative Admin authentication integrity remains active"
);

check(
    superAdminSource.includes("auth.currentUser"),
    "Super Admin remains bound to the current Firebase user"
);

check(
    cooperativeAdminSource.includes("auth.currentUser"),
    "Cooperative Admin remains bound to the current Firebase user"
);

check(
    superAdminSource.includes('doc(db, "users", user.uid)'),
    "Super Admin remains bound to the current Firestore profile"
);

check(
    cooperativeAdminSource.includes('doc(db, "users", user.uid)'),
    "Cooperative Admin remains bound to the current Firestore profile"
);

check(
    roleSource.includes("normalizeRole") &&
    roleSource.includes("rolesMatch"),
    "Authorization integrity retains canonical role matching"
);

check(
    superAdminSource.includes("rolesMatch(userData.role, \"super_admin\")"),
    "Super Admin retains explicit canonical authorization"
);

check(
    cooperativeAdminSource.includes("rolesMatch(") &&
    cooperativeAdminSource.includes('"cooperative_admin"'),
    "Cooperative Admin retains explicit canonical authorization"
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
    "Super Admin retains Cooperative Admin boundary"
);

check(
    cooperativeAdminSource.includes("super-admin.html") &&
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
        "RC151 PROTECTED DASHBOARD AUTHORIZATION INTEGRITY TEST: FAIL"
    );
    process.exitCode = 1;
} else {
    console.log(
        "RC151 PROTECTED DASHBOARD AUTHORIZATION INTEGRITY TEST: PASS"
    );
}

console.log("=========================================");
