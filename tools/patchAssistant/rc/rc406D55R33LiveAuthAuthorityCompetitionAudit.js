/**
 * ============================================================
 * ABUFAUZAN TECH CMP
 * RC406-D55R33
 * LIVE AUTHORITY / AUTH LISTENER COMPETITION AUDIT
 * ============================================================
 *
 * PURPOSE:
 * Determine whether live authentication/routing authority is
 * centralized in accessController.js or duplicated by dashboard
 * runtimes / legacy CMPAuth.
 *
 * NO PATCH IS APPLIED BY THIS SCRIPT.
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

const files = {
    accessController: "js/controllers/accessController.js",
    auth: "js/auth.js",
    cmpAuth: "js/components/auth.js",
    serviceRegistry: "js/core/serviceRegistry.js",
    superAdmin: "js/super-admin.js",
    cooperativeAdmin: "js/cooperative-admin.js",
    memberPortal: "modules/member-portal/member-portal.js"
};

function read(relativePath) {
    const fullPath = path.join(ROOT, relativePath);

    if (!fs.existsSync(fullPath)) {
        return {
            exists: false,
            source: ""
        };
    }

    return {
        exists: true,
        source: fs.readFileSync(fullPath, "utf8")
    };
}

function count(source, pattern) {
    return (source.match(pattern) || []).length;
}

function report(label, value) {
    console.log(`${label}: ${value ? "PASS" : "FAIL"}`);
}

console.log(`
============================================================
RC406-D55R33: LIVE AUTHORITY / AUTH COMPETITION AUDIT
============================================================
`);

const sources = {};

for (const [key, relativePath] of Object.entries(files)) {
    sources[key] = read(relativePath);
}

/* ============================================================
 * A. CENTRAL CONTROLLER AUTHORITY
 * ============================================================
 */

console.log("\n===== A: CENTRAL ACCESS CONTROLLER =====");

const ac = sources.accessController.source;

report(
    "A1: accessController exists",
    sources.accessController.exists
);

report(
    "A2: getAuthenticatedProfile exists",
    ac.includes("export async function getAuthenticatedProfile")
);

report(
    "A3: resolveAccess exists",
    ac.includes("export async function resolveAccess")
);

report(
    "A4: enforceDashboardAccess exists",
    ac.includes("export async function enforceDashboardAccess")
);

report(
    "A5: Firebase UID-bound profile lookup",
    ac.includes('doc(db, "users", user.uid)')
);

report(
    "A6: authoritative role normalization",
    ac.includes("normalizeRole(session.profile.role)")
);

report(
    "A7: Super Admin automatic authority",
    ac.includes('rolesMatch(actualRole, "super_admin")')
);

report(
    "A8: dashboard route map",
    ac.includes("DASHBOARD_ROUTES")
);

/* ============================================================
 * B. LOGIN ROUTING AUTHORITY
 * ============================================================
 */

console.log("\n===== B: LOGIN ROUTING =====");

const login = sources.auth.source;

report(
    "B1: login imports central controller",
    login.includes('controllers/accessController.js')
);

report(
    "B2: login calls enforceDashboardAccess",
    login.includes("enforceDashboardAccess")
);

report(
    "B3: login authenticates with Firebase",
    login.includes("signInWithEmailAndPassword")
);

report(
    "B4: login does not directly hard-code dashboard routing",
    !(
        login.includes('window.location.href = "super-admin.html"') ||
        login.includes('window.location.href = "cooperative-admin.html"') ||
        login.includes('window.location.href = "modules/member-portal/index.html"')
    )
);

/* ============================================================
 * C. DASHBOARD AUTH LISTENER INVENTORY
 * ============================================================
 */

console.log("\n===== C: DASHBOARD AUTH LISTENERS =====");

for (const [name, key] of [
    ["Super Admin", "superAdmin"],
    ["Cooperative Admin", "cooperativeAdmin"],
    ["Member Portal", "memberPortal"]
]) {
    const source = sources[key].source;

    console.log(`\n--- ${name} ---`);

    console.log(
        `onAuthStateChanged count: ${count(
            source,
            /onAuthStateChanged\s*\(/g
        )}`
    );

    console.log(
        `enforceDashboardAccess count: ${count(
            source,
            /enforceDashboardAccess\s*\(/g
        )}`
    );

    console.log(
        `window.location count: ${count(
            source,
            /window\.location/g
        )}`
    );

    report(
        `${name}: imports central controller`,
        source.includes("accessController.js")
    );

    report(
        `${name}: uses enforceDashboardAccess`,
        source.includes("enforceDashboardAccess")
    );
}

/* ============================================================
 * D. DASHBOARD DIRECT ROUTING COMPETITION
 * ============================================================
 */

console.log("\n===== D: DASHBOARD ROUTING COMPETITION =====");

const dashboardRoutePatterns = [
    "super-admin.html",
    "cooperative-admin.html",
    "modules/member-portal/index.html"
];

for (const [name, key] of [
    ["Super Admin", "superAdmin"],
    ["Cooperative Admin", "cooperativeAdmin"],
    ["Member Portal", "memberPortal"]
]) {
    const source = sources[key].source;

    const routes = dashboardRoutePatterns.filter(
        route => source.includes(route)
    );

    console.log(
        `${name} direct dashboard destinations: ${
            routes.length ? routes.join(", ") : "NONE"
        }`
    );
}

/* ============================================================
 * E. LEGACY CMPAuth AUTHORITY
 * ============================================================
 */

console.log("\n===== E: CMPAuth LEGACY / LIVE AUTHORITY =====");

const cmpAuth = sources.cmpAuth.source;
const registry = sources.serviceRegistry.source;

report(
    "E1: CMPAuth exists",
    sources.cmpAuth.exists
);

report(
    "E2: CMPAuth has currentUser",
    cmpAuth.includes("static currentUser()")
);

report(
    "E3: CMPAuth has onChange",
    cmpAuth.includes("static onChange")
);

report(
    "E4: CMPAuth has signOut",
    cmpAuth.includes("signOut")
);

report(
    "E5: serviceRegistry imports CMPAuth",
    registry.includes("CMPAuth")
);

console.log(
    `CMPAuth onAuthStateChanged count: ${
        count(cmpAuth, /onAuthStateChanged\s*\(/g)
    }`
);

/* ============================================================
 * F. SIGN-OUT AUTHORITY
 * ============================================================
 */

console.log("\n===== F: SIGN-OUT INVENTORY =====");

for (const [name, key] of [
    ["Central Access Controller", "accessController"],
    ["Login", "auth"],
    ["CMPAuth", "cmpAuth"],
    ["Super Admin", "superAdmin"],
    ["Cooperative Admin", "cooperativeAdmin"],
    ["Member Portal", "memberPortal"]
]) {
    const source = sources[key].source;

    console.log(
        `${name}: signOut=${count(source, /signOut\s*\(/g)}, ` +
        `auth.signOut=${count(source, /auth\.signOut\s*\(/g)}`
    );
}

/* ============================================================
 * G. FINAL DECISION
 * ============================================================
 */

console.log("\n===== G: RC406-D55R33 DECISION =====");

const centralAuthority =
    sources.accessController.exists &&
    ac.includes("getAuthenticatedProfile") &&
    ac.includes("resolveAccess") &&
    ac.includes("enforceDashboardAccess");

const dashboardListeners =
    ["superAdmin", "cooperativeAdmin", "memberPortal"]
        .reduce(
            (total, key) =>
                total +
                count(
                    sources[key].source,
                    /onAuthStateChanged\s*\(/g
                ),
            0
        );

const legacyAuthExists =
    sources.cmpAuth.exists &&
    cmpAuth.includes("onAuthStateChanged");

console.log(
    `CENTRAL_AUTHORITY_PRESENT: ${centralAuthority ? "YES" : "NO"}`
);

console.log(
    `DASHBOARD_AUTH_LISTENER_COUNT: ${dashboardListeners}`
);

console.log(
    `LEGACY_CMPAUTH_AUTH_LISTENER_PRESENT: ${
        legacyAuthExists ? "YES" : "NO"
    }`
);

if (centralAuthority && dashboardListeners > 0) {
    console.log(`
DECISION:
CENTRAL AUTHORITY EXISTS, BUT LIVE DASHBOARD AUTH LISTENERS
ARE ALSO PRESENT.

STATUS:
AUTHORITY-COMPETITION REVIEW REQUIRED.

IMPORTANT:
NO PATCH APPLIED.
`);
} else {
    console.log(`
DECISION:
NO CONFIRMED CENTRAL/DASHBOARD AUTHORITY COMPETITION
FROM THIS STATIC AUDIT.

STATUS:
PASS.
`);
}

console.log(`
============================================================
RC406-D55R33 COMPLETE
============================================================
`);
