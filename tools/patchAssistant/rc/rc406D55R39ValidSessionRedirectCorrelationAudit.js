/**
 * ============================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * RC406-D55R39
 * VALID SESSION → LOGIN REDIRECT CORRELATION AUDIT
 * ============================================================
 *
 * PURPOSE:
 * Correlate every live login redirect with the exact condition
 * surrounding it and determine whether a valid Firebase session
 * can reach that redirect path.
 *
 * NO PATCH APPLIED.
 * ============================================================
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

const targets = [
    "js/auth.js",
    "js/controllers/accessController.js",
    "js/super-admin.js",
    "js/cooperative-admin.js",
    "modules/member-portal/member-portal.js",
    "js/components/auth.js",
    "js/navigation/sidebar.js"
];

const patterns = [
    {
        name: "AUTH CURRENT USER",
        regex: /auth\.currentUser/g
    },
    {
        name: "AUTH STATE LISTENER",
        regex: /onAuthStateChanged\s*\(/g
    },
    {
        name: "CENTRAL ENFORCEMENT",
        regex: /enforceDashboardAccess\s*\(/g
    },
    {
        name: "ACCESS RESOLUTION",
        regex: /resolveAccess\s*\(/g
    },
    {
        name: "LOGIN REDIRECT",
        regex: /window\.location\.(?:href|assign|replace)\s*=\s*["'`][^"'`]*login\.html/g
    },
    {
        name: "ROUTE REDIRECT",
        regex: /window\.location\.(?:href|assign|replace)\s*=/g
    },
    {
        name: "RELOAD",
        regex: /window\.location\.reload\s*\(/g
    },
    {
        name: "SIGN OUT",
        regex: /(?:signOut|auth\.signOut)\s*\(/g
    },
    {
        name: "NO USER CONDITION",
        regex: /if\s*\(\s*!user\s*\)/g
    },
    {
        name: "NO SESSION CONDITION",
        regex: /if\s*\(\s*!session\s*\)/g
    },
    {
        name: "ACCESS FAILURE",
        regex: /if\s*\(\s*!access\.allowed\s*\)/g
    },
    {
        name: "CATCH",
        regex: /catch\s*\(\s*(?:error|err|e)[^)]*\)\s*\{/g
    }
];

function read(file) {
    const full = path.join(ROOT, file);

    if (!fs.existsSync(full)) {
        return null;
    }

    return fs.readFileSync(full, "utf8");
}

function lineNumber(source, index) {
    return source.slice(0, index).split("\n").length;
}

function context(source, index, radius = 180) {
    const start = Math.max(0, index - radius);
    const end = Math.min(source.length, index + radius);

    return source
        .slice(start, end)
        .replace(/\n/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function findAll(source, regex) {
    const result = [];

    regex.lastIndex = 0;

    let match;

    while ((match = regex.exec(source)) !== null) {
        result.push({
            line: lineNumber(source, match.index),
            text: match[0],
            context: context(source, match.index)
        });

        if (match.index === regex.lastIndex) {
            regex.lastIndex++;
        }
    }

    return result;
}

console.log(`
============================================================
RC406-D55R39:
VALID SESSION → LOGIN REDIRECT CORRELATION AUDIT
============================================================
`);

console.log(`
OBJECTIVE:
Determine whether any authentication redirect can execute
while a valid Firebase session is present.

This audit correlates:
1. auth.currentUser
2. onAuthStateChanged
3. enforceDashboardAccess
4. !user / !session conditions
5. access.allowed failures
6. catch-based redirects
7. signOut operations
8. reload/re-entry handlers
9. login.html destinations

NO PATCH APPLIED.
`);

let totalLoginRedirects = 0;
let suspiciousContexts = 0;

for (const file of targets) {
    const source = read(file);

    if (source === null) {
        console.log(`\n--- ${file} ---`);
        console.log("FILE: MISSING");
        continue;
    }

    console.log(`
============================================================
FILE: ${file}
============================================================
`);

    for (const pattern of patterns) {
        const matches = findAll(source, pattern.regex);

        if (matches.length === 0) {
            continue;
        }

        console.log(`===== ${pattern.name} (${matches.length}) =====`);

        for (const item of matches) {
            console.log(`LINE ${item.line}: ${item.text}`);
            console.log(`CONTEXT: ${item.context}`);
        }

        if (pattern.name === "LOGIN REDIRECT") {
            totalLoginRedirects += matches.length;
        }
    }

    /*
     * Detect the most important suspicious structural pattern:
     *
     * a redirect to login occurring inside a catch block without
     * an immediately preceding signOut/authentication failure.
     */
    const catchBlocks = [...source.matchAll(
        /catch\s*\((?:error|err|e)[^)]*\)\s*\{([\s\S]{0,1200}?)\}/g
    )];

    for (const block of catchBlocks) {
        const body = block[1] || "";

        if (
            /window\.location\.(?:href|assign|replace)\s*=\s*["'`][^"'`]*login\.html/.test(body) &&
            !/(signOut|auth\.signOut)\s*\(/.test(body)
        ) {
            suspiciousContexts++;

            console.log(`
>>> POTENTIAL VALID-SESSION REDIRECT SURFACE
Catch block contains login redirect without local signOut:
${body.replace(/\s+/g, " ").trim()}
`);
        }
    }
}

console.log(`
============================================================
RC406-D55R39 SUMMARY
============================================================

TOTAL STATIC LOGIN REDIRECTS: ${totalLoginRedirects}
POTENTIAL CATCH-REDIRECT SURFACES: ${suspiciousContexts}
`);

console.log(`
===== CENTRAL CONTROLLER SPECIFIC CORRELATION =====
`);

const controller = read("js/controllers/accessController.js");

if (controller) {
    const hasCurrentUser = /auth\.currentUser/.test(controller);
    const hasNoUserReturn = /if\s*\(\s*!user\s*\)/.test(controller);
    const hasNoSessionReturn = /if\s*\(\s*!session\s*\)/.test(controller);
    const hasAuthRequired = /AUTHENTICATION_REQUIRED/.test(controller);
    const hasSignOut = /signOut\s*\(\s*auth\s*\)/.test(controller);
    const hasLoginRedirect = /resolveAppRoute\(["']login\.html["']\)/.test(controller);

    console.log(
        "C1: auth.currentUser used: " +
        (hasCurrentUser ? "PASS" : "FAIL")
    );

    console.log(
        "C2: no-user session guard present: " +
        (hasNoUserReturn ? "PASS" : "FAIL")
    );

    console.log(
        "C3: no-session access guard present: " +
        (hasNoSessionReturn ? "PASS" : "FAIL")
    );

    console.log(
        "C4: AUTHENTICATION_REQUIRED reason present: " +
        (hasAuthRequired ? "PASS" : "FAIL")
    );

    console.log(
        "C5: controller signOut capability present: " +
        (hasSignOut ? "PASS" : "FAIL")
    );

    console.log(
        "C6: controller login redirect present: " +
        (hasLoginRedirect ? "PASS" : "FAIL")
    );

    /*
     * Important distinction:
     * The controller's login redirect is legitimate only when
     * getAuthenticatedProfile() returns null.
     */
    const profileFunction = controller.match(
        /export async function getAuthenticatedProfile\(\)[\s\S]*?return \{[\s\S]*?\};\s*\}/
    );

    console.log(`
C7: getAuthenticatedProfile() is the gate preceding
    AUTHENTICATION_REQUIRED: ${
        profileFunction ? "PASS" : "REVIEW"
    }
`);
}

console.log(`
============================================================
RC406-D55R39 DECISION
============================================================
`);

if (suspiciousContexts === 0) {
    console.log(`
DECISION:
NO CONFIRMED CATCH-BASED VALID-SESSION LOGIN REDIRECT.

The static structure does not show a catch block that redirects
to login.html without an explicit sign-out.

STATUS:
NO CONFIRMED DEFECT FROM THIS AUDIT.

NEXT:
LIVE BROWSER CORRELATION REMAINS REQUIRED.
`);
} else {
    console.log(`
DECISION:
POTENTIAL VALID-SESSION LOGIN REDIRECT SURFACE DETECTED.

The affected catch context must be correlated with actual
Firebase auth state before any repair is applied.

STATUS:
REVIEW REQUIRED.

NO PATCH APPLIED.
`);
}

console.log(`
============================================================
RC406-D55R39 COMPLETE
============================================================
`);
