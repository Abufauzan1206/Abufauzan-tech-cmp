/**
 * ============================================================
 * ABUFAUZAN TECH CMP
 * RC406-D55R35
 * LOGIN → AUTH STATE → DASHBOARD TIMING TRACE
 * ============================================================
 *
 * PURPOSE:
 * Trace whether dashboard access can execute before Firebase
 * authentication state is reliably available after login.
 *
 * NO PATCH APPLIED.
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

const TARGETS = [
    "js/auth.js",
    "js/controllers/accessController.js",
    "js/firebase-config.js",
    "js/super-admin.js",
    "js/cooperative-admin.js",
    "modules/member-portal/member-portal.js"
];

function read(file) {
    const full = path.join(ROOT, file);

    if (!fs.existsSync(full)) {
        return "";
    }

    return fs.readFileSync(full, "utf8");
}

function trace(file, patterns) {
    const source = read(file);

    console.log(`\n--- ${file} ---`);

    source.split("\n").forEach((line, index) => {
        if (patterns.some(pattern => pattern.test(line))) {
            console.log(
                `${String(index + 1).padStart(4)} | ${line.trim()}`
            );
        }
    });
}

console.log(`
============================================================
RC406-D55R35: LOGIN → AUTH STATE → DASHBOARD TIMING TRACE
============================================================
`);

console.log("===== A: LOGIN AUTHENTICATION SEQUENCE =====");

trace("js/auth.js", [
    /signInWithEmailAndPassword/,
    /userCredential/,
    /currentUser/,
    /onAuthStateChanged/,
    /enforceDashboardAccess/,
    /resolveAccess/,
    /window\.location/,
    /await/
]);

console.log("\n===== B: CENTRAL PROFILE RESOLUTION =====");

trace("js/controllers/accessController.js", [
    /auth\.currentUser/,
    /getAuthenticatedProfile/,
    /getDoc/,
    /users/,
    /onAuthStateChanged/,
    /enforceDashboardAccess/,
    /resolveAccess/,
    /window\.location/
]);

console.log("\n===== C: FIREBASE AUTH INITIALIZATION =====");

trace("js/firebase-config.js", [
    /initializeApp/,
    /getAuth/,
    /auth/,
    /initializeAuth/,
    /browserLocalPersistence/,
    /browserSessionPersistence/,
    /setPersistence/
]);

console.log("\n===== D: SUPER ADMIN AUTH TIMING =====");

trace("js/super-admin.js", [
    /onAuthStateChanged/,
    /auth\.currentUser/,
    /enforceDashboardAccess/,
    /window\.location/,
    /reload/
]);

console.log("\n===== E: COOPERATIVE ADMIN AUTH TIMING =====");

trace("js/cooperative-admin.js", [
    /onAuthStateChanged/,
    /auth\.currentUser/,
    /enforceDashboardAccess/,
    /window\.location/,
    /reload/
]);

console.log("\n===== F: MEMBER PORTAL AUTH TIMING =====");

trace("modules/member-portal/member-portal.js", [
    /onAuthStateChanged/,
    /auth\.currentUser/,
    /enforceDashboardAccess/,
    /window\.location/,
    /reload/
]);

const authSource = read("js/auth.js");
const controllerSource =
    read("js/controllers/accessController.js");
const firebaseSource =
    read("js/firebase-config.js");

const loginUsesSignIn =
    /signInWithEmailAndPassword\s*\(/.test(authSource);

const loginAwaitsSignIn =
    /await\s+signInWithEmailAndPassword\s*\(/.test(authSource);

const loginCallsEnforce =
    /enforceDashboardAccess\s*\(/.test(authSource);

const controllerReadsCurrentUser =
    /auth\.currentUser/.test(controllerSource);

const controllerWaitsForAuthState =
    /onAuthStateChanged/.test(controllerSource);

const firebaseInitializesAuth =
    /getAuth\s*\(/.test(firebaseSource) ||
    /initializeAuth\s*\(/.test(firebaseSource);

console.log(`
===== G: RC406-D55R35 DECISION =====

LOGIN_USES_FIREBASE_EMAIL_PASSWORD:
${loginUsesSignIn ? "YES" : "NO"}

LOGIN_AWAITS_SIGN_IN:
${loginAwaitsSignIn ? "YES" : "NO"}

LOGIN_CALLS_ENFORCE_DASHBOARD_ACCESS:
${loginCallsEnforce ? "YES" : "NO"}

CENTRAL_CONTROLLER_READS_AUTH_CURRENT_USER:
${controllerReadsCurrentUser ? "YES" : "NO"}

CENTRAL_CONTROLLER_HAS_AUTH_STATE_LISTENER:
${controllerWaitsForAuthState ? "YES" : "NO"}

FIREBASE_AUTH_INITIALIZED:
${firebaseInitializesAuth ? "YES" : "NO"}
`);

if (
    loginUsesSignIn &&
    loginAwaitsSignIn &&
    loginCallsEnforce &&
    controllerReadsCurrentUser &&
    !controllerWaitsForAuthState
) {
    console.log(`
DECISION:
LOGIN AWAITS FIREBASE SIGN-IN, BUT CENTRAL PROFILE RESOLUTION
DEPENDS DIRECTLY ON auth.currentUser WITHOUT AN INTERNAL
AUTH-STATE READINESS WAIT.

TIMING RISK:
PRESENT.

STATUS:
REVIEW REQUIRED.
`);
} else {
    console.log(`
DECISION:
NO CONFIRMED LOGIN/AUTH-STATE TIMING DEFECT FROM THIS
STATIC TRACE.

STATUS:
REVIEW REQUIRED / CORRELATE WITH LIVE RUNTIME.
`);
}

console.log(`
============================================================
RC406-D55R35 COMPLETE
============================================================
`);
