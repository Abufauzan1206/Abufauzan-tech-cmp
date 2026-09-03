/**
 * ============================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * RC406-D55R38
 * REDIRECT CONDITION / CONTEXT AUDIT
 * ============================================================
 *
 * Purpose:
 * Inspect the actual conditional context surrounding every
 * authentication redirect, enforcement failure, logout redirect,
 * and dashboard reload in the live runtime.
 *
 * NO PATCH APPLIED.
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

const TARGETS = [
    "js/auth.js",
    "js/controllers/accessController.js",
    "js/super-admin.js",
    "js/cooperative-admin.js",
    "modules/member-portal/member-portal.js",
    "js/components/auth.js",
    "js/navigation/sidebar.js"
];

function read(file) {
    const full = path.join(ROOT, file);

    if (!fs.existsSync(full)) {
        return "";
    }

    return fs.readFileSync(full, "utf8");
}

function printContext(file, source, index, radius = 4) {
    const lines = source.split("\n");

    const start = Math.max(0, index - radius);
    const end = Math.min(
        lines.length,
        index + radius + 1
    );

    for (let i = start; i < end; i++) {
        console.log(
            `${String(i + 1).padStart(4)} | ${lines[i]}`
        );
    }
}

function auditFile(file) {
    const source = read(file);

    console.log(`
============================================================
FILE: ${file}
============================================================
`);

    if (!source) {
        console.log("FILE STATUS: NOT FOUND");
        return;
    }

    const lines = source.split("\n");

    const patterns = [
        {
            label: "AUTH REDIRECT",
            regex:
                /window\.location\.(href|replace|assign)\s*=/
        },
        {
            label: "RELOAD",
            regex:
                /window\.location\.reload\s*\(/
        },
        {
            label: "AUTH LISTENER",
            regex:
                /onAuthStateChanged\s*\(/
        },
        {
            label: "CENTRAL ENFORCEMENT",
            regex:
                /enforceDashboardAccess\s*\(/
        },
        {
            label: "ACCESS FAILURE",
            regex:
                /if\s*\(\s*!access\.allowed\s*\)/
        },
        {
            label: "USER FAILURE",
            regex:
                /if\s*\(\s*!user\s*\)/
        },
        {
            label: "SESSION FAILURE",
            regex:
                /if\s*\(\s*!session\s*\)/
        },
        {
            label: "EXCEPTION HANDLER",
            regex:
                /catch\s*\(/
        },
        {
            label: "SIGN OUT",
            regex:
                /(?:await\s+)?(?:signOut|auth\.signOut)\s*\(/
        }
    ];

    for (const item of patterns) {
        console.log(`
===== ${item.label} =====
`);

        let found = 0;

        lines.forEach((line, index) => {
            item.regex.lastIndex = 0;

            if (item.regex.test(line)) {
                found++;

                console.log(
                    `\n>>> ${file}:${index + 1}`
                );

                printContext(
                    file,
                    source,
                    index,
                    5
                );
            }

            item.regex.lastIndex = 0;
        });

        console.log(
            `\n${item.label} COUNT: ${found}`
        );
    }
}

console.log(`
============================================================
RC406-D55R38:
REDIRECT CONDITION / CONTEXT AUDIT
============================================================

OBJECTIVE:
Identify the exact conditional context responsible for every
authentication redirect and determine whether it can execute
while a valid Firebase session exists.

NO PATCH APPLIED.
`);

for (const file of TARGETS) {
    auditFile(file);
}

console.log(`
============================================================
RC406-D55R38: CROSS-FILE DECISION MATRIX
============================================================
`);

const files = {
    LOGIN: read("js/auth.js"),
    CONTROLLER: read(
        "js/controllers/accessController.js"
    ),
    SUPER_ADMIN: read("js/super-admin.js"),
    COOPERATIVE_ADMIN: read(
        "js/cooperative-admin.js"
    ),
    MEMBER_PORTAL: read(
        "modules/member-portal/member-portal.js"
    ),
    CMPAUTH: read("js/components/auth.js"),
    SIDEBAR: read("js/navigation/sidebar.js")
};

for (const [name, source] of Object.entries(files)) {
    const redirectCount =
        (
            source.match(
                /window\.location\.(?:href|replace|assign)\s*=/g
            ) || []
        ).length;

    const reloadCount =
        (
            source.match(
                /window\.location\.reload\s*\(/g
            ) || []
        ).length;

    const listenerCount =
        (
            source.match(
                /onAuthStateChanged\s*\(/g
            ) || []
        ).length;

    const enforcementCount =
        (
            source.match(
                /enforceDashboardAccess\s*\(/g
            ) || []
        ).length;

    const signOutCount =
        (
            source.match(
                /(?:signOut|auth\.signOut)\s*\(/g
            ) || []
        ).length;

    console.log(
        `${name}: redirects=${redirectCount}, reloads=${reloadCount}, authListeners=${listenerCount}, enforcement=${enforcementCount}, signOut=${signOutCount}`
    );
}

console.log(`
============================================================
RC406-D55R38 DECISION RULE
============================================================

The following must NOT be treated as an authentication defect
by themselves:

- explicit logout redirect,
- missing-user redirect,
- legitimate unauthorized-role rejection,
- dashboard history reload.

The following require immediate review:

1. A catch block redirects to login despite a valid Firebase user.
2. Central enforcement redirects to login after auth.currentUser
   has already been established.
3. A dashboard auth listener redirects to login because of a
   transient null user during initial Firebase initialization.
4. Dashboard reload logic causes a second authentication decision
   before the first decision has stabilized.
5. An authenticated user's valid profile is interpreted as absent.
6. A route comparison causes a dashboard to redirect unexpectedly.

DECISION:
CONTEXT TRACE COMPLETE.

STATUS:
REVIEW REQUIRED.

NO PATCH APPLIED.

============================================================
RC406-D55R38 COMPLETE
============================================================
`);
