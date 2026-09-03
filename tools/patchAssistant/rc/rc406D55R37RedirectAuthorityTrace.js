/**
 * ============================================================
 * ABUFAUZAN TECH CMP
 * RC406-D55R37
 * REDIRECT / RELOAD AUTHORITY TRACE
 * ============================================================
 *
 * Purpose:
 * Identify every live redirect/reload decision in the
 * authentication/dashboard runtime and classify its condition.
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

function printMatches(file, regex) {
    const source = read(file);

    console.log(`\n--- ${file} ---`);

    source.split("\n").forEach((line, index) => {
        if (regex.test(line)) {
            console.log(
                `${String(index + 1).padStart(4)} | ${line.trim()}`
            );
        }

        regex.lastIndex = 0;
    });
}

console.log(`
============================================================
RC406-D55R37: REDIRECT / RELOAD AUTHORITY TRACE
============================================================
`);

console.log(`
===== A: ALL LIVE NAVIGATION COMMANDS =====
`);

for (const file of TARGETS) {
    printMatches(
        file,
        /window\.location|location\.href|location\.replace|location\.assign|location\.reload/
    );
}

console.log(`
===== B: AUTHENTICATION FAILURE CONDITIONS =====
`);

for (const file of TARGETS) {
    printMatches(
        file,
        /if\s*\(\s*!user|if\s*\(\s*!session|AUTHENTICATION_REQUIRED|LOGIN_AS_ROLE_MISMATCH|NO_DASHBOARD_ROUTE|!access\.allowed|catch\s*\(/
    );
}

console.log(`
===== C: CENTRAL CONTROLLER REDIRECT LOGIC =====
`);

const controller = read(
    "js/controllers/accessController.js"
);

controller.split("\n").forEach((line, index) => {
    if (
        /window\.location|AUTHENTICATION_REQUIRED|!session|!result\.allowed|destinationUrl|currentUrl/.test(
            line
        )
    ) {
        console.log(
            `${String(index + 1).padStart(4)} | ${line.trim()}`
        );
    }
});

console.log(`
===== D: LOGIN ROUTING LOGIC =====
`);

const login = read("js/auth.js");

login.split("\n").forEach((line, index) => {
    if (
        /signInWithEmailAndPassword|enforceDashboardAccess|window\.location|signOut|catch|access\.allowed/.test(
            line
        )
    ) {
        console.log(
            `${String(index + 1).padStart(4)} | ${line.trim()}`
        );
    }
});

console.log(`
===== E: DASHBOARD AUTH CALLBACKS =====
`);

for (const [name, file] of [
    ["Super Admin", "js/super-admin.js"],
    ["Cooperative Admin", "js/cooperative-admin.js"],
    [
        "Member Portal",
        "modules/member-portal/member-portal.js"
    ]
]) {
    const source = read(file);

    console.log(`\n--- ${name} ---`);

    const lines = source.split("\n");

    let insideListener = false;
    let depth = 0;

    lines.forEach((line, index) => {
        if (
            line.includes("onAuthStateChanged")
        ) {
            insideListener = true;
            depth = 0;
        }

        if (insideListener) {
            if (
                /if\s*\(\s*!user/.test(line) ||
                /enforceDashboardAccess/.test(line) ||
                /window\.location/.test(line) ||
                /signOut/.test(line) ||
                /catch\s*\(/.test(line)
            ) {
                console.log(
                    `${String(index + 1).padStart(4)} | ${line.trim()}`
                );
            }

            depth +=
                (line.match(/{/g) || []).length;

            depth -=
                (line.match(/}/g) || []).length;

            if (depth <= 0 && index > 0) {
                insideListener = false;
            }
        }
    });
}

console.log(`
===== F: REDIRECT DESTINATION CLASSIFICATION =====
`);

const files = {
    login: login,
    controller: controller,
    superAdmin: read("js/super-admin.js"),
    cooperativeAdmin: read("js/cooperative-admin.js"),
    memberPortal: read(
        "modules/member-portal/member-portal.js"
    )
};

for (const [name, source] of Object.entries(files)) {
    const loginRedirects =
        (
            source.match(
                /(?:window\.)?location\.(?:href|replace|assign)\s*=\s*[^;\n]*login\.html/g
            ) || []
        ).length;

    const dashboardRedirects =
        (
            source.match(
                /(?:window\.)?location\.(?:href|replace|assign)\s*=\s*[^;\n]*(?:super-admin|cooperative-admin|member-portal)/g
            ) || []
        ).length;

    const reloads =
        (
            source.match(
                /(?:window\.)?location\.reload\s*\(/g
            ) || []
        ).length;

    console.log(
        `${name}: login=${loginRedirects}, dashboard=${dashboardRedirects}, reload=${reloads}`
    );
}

console.log(`
===== G: RC406-D55R37 DECISION =====

The purpose of this audit is NOT to count redirects only.

The critical evidence is the condition immediately surrounding
each authentication redirect and whether the redirect originates
from:

1. authentication failure,
2. missing profile,
3. role mismatch,
4. missing route,
5. dashboard history protection,
6. logout,
7. central access enforcement,
8. exception handling.

DECISION:
REDIRECT AUTHORITY TRACE COMPLETE.

STATUS:
REVIEW REQUIRED.

NO PATCH APPLIED.
`);

console.log(`
============================================================
RC406-D55R37 COMPLETE
============================================================
`);
