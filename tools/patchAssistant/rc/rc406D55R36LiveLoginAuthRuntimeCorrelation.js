/**
 * ============================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * RC406-D55R36
 * LIVE LOGIN / AUTH-STATE RUNTIME CORRELATION AUDIT
 * ============================================================
 *
 * Purpose:
 * Correlate the static login/auth/dashboard sequence and identify
 * whether multiple authentication decision points can execute
 * against the same Firebase session during dashboard entry.
 *
 * NO PATCH IS APPLIED.
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

const files = {
    login: path.join(ROOT, "js/auth.js"),
    controller: path.join(
        ROOT,
        "js/controllers/accessController.js"
    ),
    superAdmin: path.join(ROOT, "js/super-admin.js"),
    cooperativeAdmin: path.join(
        ROOT,
        "js/cooperative-admin.js"
    ),
    memberPortal: path.join(
        ROOT,
        "modules/member-portal/member-portal.js"
    ),
    firebase: path.join(ROOT, "js/firebase-config.js")
};

function read(file) {
    if (!fs.existsSync(file)) {
        return "";
    }

    return fs.readFileSync(file, "utf8");
}

function count(source, pattern) {
    return (source.match(pattern) || []).length;
}

function has(source, text) {
    return source.includes(text);
}

console.log(`
============================================================
RC406-D55R36: LIVE LOGIN / AUTH-STATE RUNTIME CORRELATION
============================================================
`);

const login = read(files.login);
const controller = read(files.controller);
const superAdmin = read(files.superAdmin);
const cooperativeAdmin = read(files.cooperativeAdmin);
const memberPortal = read(files.memberPortal);
const firebase = read(files.firebase);

console.log(`
===== A: LOGIN EXECUTION ORDER =====
`);

console.log(
    "A1: Firebase sign-in present:",
    has(login, "signInWithEmailAndPassword")
        ? "PASS"
        : "FAIL"
);

console.log(
    "A2: sign-in is awaited:",
    has(
        login,
        "await signInWithEmailAndPassword"
    )
        ? "PASS"
        : "FAIL"
);

console.log(
    "A3: Login invokes central enforcement:",
    has(
        login,
        "await enforceDashboardAccess"
    )
        ? "PASS"
        : "FAIL"
);

console.log(
    "A4: Login has auth-state listener:",
    count(
        login,
        /onAuthStateChanged/g
    ) > 0
        ? "PRESENT"
        : "ABSENT"
);

console.log(`
===== B: CENTRAL CONTROLLER EXECUTION =====
`);

console.log(
    "B1: getAuthenticatedProfile:",
    has(
        controller,
        "export async function getAuthenticatedProfile"
    )
        ? "PASS"
        : "FAIL"
);

console.log(
    "B2: auth.currentUser lookup:",
    has(
        controller,
        "auth.currentUser"
    )
        ? "PASS"
        : "FAIL"
);

console.log(
    "B3: Firestore users/{uid} lookup:",
    has(
        controller,
        'doc(db, "users", user.uid)'
    )
        ? "PASS"
        : "FAIL"
);

console.log(
    "B4: resolveAccess called by enforcement:",
    has(
        controller,
        "await resolveAccess(effectiveRequestedRole)"
    )
        ? "PASS"
        : "FAIL"
);

console.log(
    "B5: central auth-state listener capability:",
    has(
        controller,
        "onAuthStateChanged(auth, callback)"
    )
        ? "PRESENT"
        : "ABSENT"
);

console.log(`
===== C: DASHBOARD ENTRY LISTENERS =====
`);

const dashboards = [
    ["Super Admin", superAdmin],
    ["Cooperative Admin", cooperativeAdmin],
    ["Member Portal", memberPortal]
];

for (const [name, source] of dashboards) {
    console.log(`
--- ${name} ---`);

    console.log(
        "onAuthStateChanged:",
        count(
            source,
            /onAuthStateChanged\s*\(/g
        )
    );

    console.log(
        "enforceDashboardAccess:",
        count(
            source,
            /enforceDashboardAccess\s*\(/g
        )
    );

    console.log(
        "signOut:",
        count(
            source,
            /signOut\s*\(/g
        )
    );

    console.log(
        "login redirect:",
        count(
            source,
            /window\.location\.(href|replace|assign)/g
        )
    );
}

console.log(`
===== D: AUTH STATE → ENFORCEMENT RELATIONSHIP =====
`);

for (const [name, source] of dashboards) {
    const listener =
        source.indexOf("onAuthStateChanged");

    const enforcement =
        source.indexOf("enforceDashboardAccess");

    let relationship = "NOT DETERMINED";

    if (listener >= 0 && enforcement >= 0) {
        if (enforcement > listener) {
            relationship =
                "ENFORCEMENT APPEARS INSIDE/AFTER AUTH LISTENER";
        } else {
            relationship =
                "ENFORCEMENT APPEARS BEFORE AUTH LISTENER";
        }
    }

    console.log(
        `${name}: ${relationship}`
    );
}

console.log(`
===== E: POSSIBLE LOGIN → DASHBOARD DOUBLE DECISION =====
`);

const loginCallsEnforcement =
    has(login, "await enforceDashboardAccess");

const dashboardsListen =
    dashboards.every(
        ([, source]) =>
            has(source, "onAuthStateChanged")
    );

const dashboardsEnforce =
    dashboards.every(
        ([, source]) =>
            has(source, "enforceDashboardAccess")
    );

console.log(
    "E1: Login performs central access decision:",
    loginCallsEnforcement ? "YES" : "NO"
);

console.log(
    "E2: Dashboard performs auth-state observation:",
    dashboardsListen ? "YES" : "NO"
);

console.log(
    "E3: Dashboard performs central enforcement:",
    dashboardsEnforce ? "YES" : "NO"
);

if (
    loginCallsEnforcement &&
    dashboardsListen &&
    dashboardsEnforce
) {
    console.log(`
E4: LOGIN + DASHBOARD DECISION CHAIN:
PRESENT

Interpretation:
The login page performs an access decision after successful
authentication, while the destination dashboard subsequently
receives Firebase auth-state notification and performs another
central access decision.

This is NOT by itself an authorization defect.

It establishes a potential timing/re-entry surface that must
be correlated against browser runtime behavior.
`);
} else {
    console.log(`
E4: LOGIN + DASHBOARD DECISION CHAIN:
NOT FULLY PRESENT
`);
}

console.log(`
===== F: REDIRECT LOOP INDICATORS =====
`);

for (const [name, source] of dashboards) {
    const loginRedirects =
        count(
            source,
            /window\.location\.href\s*=\s*["'][^"']*login\.html/g
        );

    const reloads =
        count(
            source,
            /window\.location\.reload\s*\(/g
        );

    console.log(
        `${name}: loginRedirects=${loginRedirects}, reloads=${reloads}`
    );
}

const controllerRedirects =
    count(
        controller,
        /window\.location\.href\s*=/g
    );

console.log(
    `Central Access Controller redirects: ${controllerRedirects}`
);

console.log(`
===== G: FIREBASE INITIALIZATION =====
`);

console.log(
    "G1: initializeApp:",
    has(firebase, "initializeApp")
        ? "PASS"
        : "FAIL"
);

console.log(
    "G2: getAuth:",
    has(firebase, "getAuth")
        ? "PASS"
        : "FAIL"
);

console.log(`
===== H: RC406-D55R36 DECISION =====
`);

if (
    loginCallsEnforcement &&
    dashboardsListen &&
    dashboardsEnforce
) {
    console.log(`
LOGIN_DECISION + DASHBOARD_AUTH_LISTENER + DASHBOARD_ENFORCEMENT:
CONFIRMED STATIC CHAIN

No live browser timing failure can be declared from source
inspection alone.

DECISION:
LIVE BROWSER CORRELATION REQUIRED.

STATUS:
REVIEW REQUIRED.

NO PATCH APPLIED.
`);
} else {
    console.log(`
DECISION:
LOGIN/AUTH/DASHBOARD CHAIN IS NOT FULLY CONFIRMED.

STATUS:
REVIEW REQUIRED.

NO PATCH APPLIED.
`);
}

console.log(`
============================================================
RC406-D55R36 COMPLETE
============================================================
`);
