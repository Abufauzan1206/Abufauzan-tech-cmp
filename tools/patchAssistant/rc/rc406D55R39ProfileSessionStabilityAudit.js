/**
 * ============================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * RC406-D55R39
 * PROFILE / SESSION STABILITY AUDIT
 * ============================================================
 *
 * PURPOSE:
 * Determine whether the Central Access Controller can interpret
 * a valid Firebase-authenticated user as an absent session/profile
 * during dashboard entry.
 *
 * Focus:
 *   auth.currentUser
 *   onAuthStateChanged
 *   getAuthenticatedProfile()
 *   users/{uid}
 *   Firestore profile existence
 *   AUTHENTICATION_REQUIRED
 *   dashboard enforcement
 *
 * NO PATCH APPLIED.
 * ============================================================
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

const targets = [
    "js/controllers/accessController.js",
    "js/auth.js",
    "js/super-admin.js",
    "js/cooperative-admin.js",
    "modules/member-portal/member-portal.js",
    "js/firebase-config.js"
];

function read(file) {
    const full = path.join(ROOT, file);

    if (!fs.existsSync(full)) {
        return null;
    }

    return fs.readFileSync(full, "utf8");
}

function has(source, pattern) {
    return pattern.test(source);
}

function section(title) {
    console.log(`
============================================================
${title}
============================================================
`);
}

function printResult(label, value) {
    console.log(`${label}: ${value ? "PASS" : "FAIL"}`);
}

section("RC406-D55R39: PROFILE / SESSION STABILITY AUDIT");

console.log(`
OBJECTIVE:
Determine whether a valid Firebase session can be incorrectly
classified as unauthenticated because the Central Access Controller
reads auth.currentUser before Firebase authentication state has
stabilized, or because users/{uid} is temporarily interpreted as
an absent profile.

NO PATCH APPLIED.
`);

const controller = read("js/controllers/accessController.js");

if (!controller) {
    console.error("FATAL: accessController.js not found.");
    process.exit(1);
}

section("A: CENTRAL PROFILE RESOLUTION");

const currentUser = has(
    controller,
    /auth\.currentUser/
);

const profileLookup = has(
    controller,
    /doc\s*\(\s*db\s*,\s*["']users["']\s*,\s*user\.uid\s*\)/
);

const getDocPresent = has(
    controller,
    /getDoc\s*\(/
);

const profileExistsCheck = has(
    controller,
    /profileSnap\.exists\s*\(\s*\)/
);

const nullProfileReturn = has(
    controller,
    /if\s*\(\s*!profileSnap\.exists\s*\(\)\s*\)\s*\{[\s\S]*?return\s+null/
);

const authenticatedProfileFunction = has(
    controller,
    /export\s+async\s+function\s+getAuthenticatedProfile\s*\(/
);

printResult(
    "A1: getAuthenticatedProfile exists",
    authenticatedProfileFunction
);

printResult(
    "A2: auth.currentUser is the session source",
    currentUser
);

printResult(
    "A3: Firestore users/{uid} lookup present",
    profileLookup
);

printResult(
    "A4: getDoc profile read present",
    getDocPresent
);

printResult(
    "A5: profile existence check present",
    profileExistsCheck
);

printResult(
    "A6: missing profile returns null",
    nullProfileReturn
);

section("B: AUTH STATE INITIALIZATION RELATIONSHIP");

const authListenerInController = has(
    controller,
    /onAuthStateChanged\s*\(\s*auth/
);

const controllerReadsCurrentUserBeforeListener = (() => {
    const currentIndex = controller.indexOf("auth.currentUser");
    const listenerIndex = controller.indexOf("onAuthStateChanged");

    return (
        currentIndex !== -1 &&
        listenerIndex !== -1 &&
        currentIndex < listenerIndex
    );
})();

printResult(
    "B1: Central controller exposes auth-state listener",
    authListenerInController
);

console.log(
    "B2: getAuthenticatedProfile reads auth.currentUser directly: " +
    (currentUser ? "YES" : "NO")
);

console.log(
    "B3: Controller currentUser reference appears before listener declaration: " +
    (controllerReadsCurrentUserBeforeListener ? "YES" : "NO")
);

console.log(`
IMPORTANT:
B3 is a source-order observation only.
It does NOT prove that Firebase auth.currentUser is invalid.
`);

section("C: AUTHENTICATION_REQUIRED PATH");

const authenticationRequired = has(
    controller,
    /reason:\s*["']AUTHENTICATION_REQUIRED["']/
);

const noUserGuard = has(
    controller,
    /if\s*\(\s*!user\s*\)\s*\{[\s\S]*?return\s+null/
);

const noSessionGuard = has(
    controller,
    /if\s*\(\s*!session\s*\)\s*\{/
);

const controllerLoginRedirect = has(
    controller,
    /resolveAppRoute\s*\(\s*["']login\.html["']\s*\)/
);

printResult(
    "C1: AUTHENTICATION_REQUIRED reason exists",
    authenticationRequired
);

printResult(
    "C2: getAuthenticatedProfile has no-user guard",
    noUserGuard
);

printResult(
    "C3: resolveAccess/enforcement has no-session guard",
    noSessionGuard
);

printResult(
    "C4: Central controller can redirect to login",
    controllerLoginRedirect
);

section("D: PROFILE ABSENCE VS AUTH ABSENCE");

const lines = controller.split("\n");

const profileBlockStart = lines.findIndex(
    line => line.includes("export async function getAuthenticatedProfile")
);

if (profileBlockStart >= 0) {
    const block = lines.slice(
        profileBlockStart,
        Math.min(profileBlockStart + 35, lines.length)
    ).join("\n");

    console.log("getAuthenticatedProfile() source window:");
    console.log("------------------------------------------------------------");
    console.log(block);
    console.log("------------------------------------------------------------");

    const userNull = /if\s*\(\s*!user\s*\)/.test(block);
    const profileNull = /if\s*\(\s*!profileSnap\.exists\s*\(\s*\)\s*\)/.test(block);

    console.log(
        "D1: Firebase user absence is independently detected: " +
        (userNull ? "YES" : "NO")
    );

    console.log(
        "D2: Firestore profile absence is independently detected: " +
        (profileNull ? "YES" : "NO")
    );

    console.log(`
D3: The controller currently collapses both conditions into
    getAuthenticatedProfile() === null.

This is an architectural observation, not yet a confirmed defect.
`);
}

section("E: DASHBOARD ENTRY CONTRACTS");

const dashboardContracts = [
    ["Super Admin", "js/super-admin.js", "enforceDashboardAccess()"],
    [
        "Cooperative Admin",
        "js/cooperative-admin.js",
        'enforceDashboardAccess("cooperative_admin")'
    ],
    [
        "Member Portal",
        "modules/member-portal/member-portal.js",
        'enforceDashboardAccess("member")'
    ]
];

for (const [name, file, enforcementText] of dashboardContracts) {
    const source = read(file);

    console.log(`--- ${name} ---`);

    if (!source) {
        console.log("FILE: MISSING");
        continue;
    }

    const listener = /onAuthStateChanged\s*\(\s*auth/.test(source);
    const enforcement = source.includes(enforcementText);
    const nullRedirect = /if\s*\(\s*!user\s*\)/.test(source);

    printResult("Auth-state listener", listener);
    printResult("Central enforcement", enforcement);
    printResult("Null-user redirect guard", nullRedirect);

    console.log();
}

section("F: FIREBASE INITIALIZATION");

const firebaseConfig = read("js/firebase-config.js");

if (!firebaseConfig) {
    console.log("firebase-config.js: MISSING");
} else {
    printResult(
        "F1: initializeApp present",
        /initializeApp\s*\(/.test(firebaseConfig)
    );

    printResult(
        "F2: getAuth present",
        /getAuth\s*\(/.test(firebaseConfig)
    );

    printResult(
        "F3: single exported auth instance present",
        /export\s+const\s+auth\s*=\s*getAuth\s*\(/.test(firebaseConfig)
    );
}

section("G: STABILITY RISK CLASSIFICATION");

const risks = [];

if (currentUser && authListenerInController) {
    risks.push(
        "CENTRAL_CONTROLLER_HAS_BOTH_CURRENTUSER_AND_AUTH_STATE_LISTENER"
    );
}

if (nullProfileReturn) {
    risks.push(
        "MISSING_FIRESTORE_PROFILE_IS_TREATED_AS_NO_SESSION"
    );
}

if (controllerLoginRedirect) {
    risks.push(
        "CENTRAL_CONTROLLER_CAN_REDIRECT_TO_LOGIN"
    );
}

if (
    dashboardContracts.every(([, file]) => {
        const source = read(file);
        return source && /onAuthStateChanged\s*\(\s*auth/.test(source);
    })
) {
    risks.push(
        "ALL_THREE_DASHBOARDS_HAVE_AUTH_STATE_ENTRY_LISTENERS"
    );
}

for (const risk of risks) {
    console.log(`RISK: ${risk}`);
}

section("H: RC406-D55R39 DECISION");

console.log(`
The audit must NOT declare a timing defect merely because:
- auth.currentUser is used;
- onAuthStateChanged is also used;
- getDoc() is asynchronous;
- dashboards have auth listeners;
- redirects exist.

A defect requires evidence that a valid Firebase session is
actually being classified as absent, or that profile resolution
can fail transiently and trigger login redirection.

DECISION:
STATIC PROFILE / SESSION STABILITY CORRELATION COMPLETE.

STATUS:
REVIEW REQUIRED — LIVE BROWSER AUTH STATE + FIRESTORE PROFILE
CORRELATION IS THE NEXT EVIDENCE REQUIRED.

NO PATCH APPLIED.
`);

console.log(`
============================================================
RC406-D55R39 COMPLETE
============================================================
`);
