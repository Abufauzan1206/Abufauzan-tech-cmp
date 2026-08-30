/**
 * ============================================================
 * ABUFAUZAN TECH CMP
 * RC406-D55R34
 * LIVE AUTH CONSUMER / CMPAUTH EXECUTION TRACE
 * ============================================================
 *
 * PURPOSE:
 * Determine whether CMPAuth is an active authorization authority
 * in the live dashboard execution graph, or merely a legacy
 * service-layer abstraction.
 *
 * NO PATCH IS APPLIED.
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

const TARGETS = [
    "js/auth.js",
    "js/components/auth.js",
    "js/core/serviceRegistry.js",
    "js/super-admin.js",
    "js/cooperative-admin.js",
    "modules/member-portal/member-portal.js",
    "js/controllers/accessController.js",
    "js/navigation/sidebar.js"
];

function read(file) {
    const full = path.join(ROOT, file);

    if (!fs.existsSync(full)) {
        return "";
    }

    return fs.readFileSync(full, "utf8");
}

function linesContaining(source, patterns) {
    return source
        .split("\n")
        .map((line, index) => ({
            line: index + 1,
            text: line
        }))
        .filter(({ text }) =>
            patterns.some(pattern => pattern.test(text))
        );
}

console.log(`
============================================================
RC406-D55R34: LIVE AUTH CONSUMER / CMPAUTH EXECUTION TRACE
============================================================
`);

const sources = {};

for (const file of TARGETS) {
    sources[file] = read(file);
}

/* ============================================================
 * A. CMPAuth CONSUMER TRACE
 * ============================================================
 */

console.log("\n===== A: CMPAUTH CONSUMER TRACE =====");

const cmpConsumers = [];

for (const file of TARGETS) {
    if (file === "js/components/auth.js") {
        continue;
    }

    const source = sources[file];

    if (
        source.includes("CMPAuth") ||
        source.includes("components/auth.js")
    ) {
        cmpConsumers.push(file);
    }
}

if (cmpConsumers.length) {
    console.log("CMPAuth references found in:");

    for (const file of cmpConsumers) {
        console.log(`  - ${file}`);
    }
} else {
    console.log("CMPAuth references found in: NONE");
}

/* ============================================================
 * B. LIVE DASHBOARD AUTH FLOW
 * ============================================================
 */

console.log("\n===== B: LIVE DASHBOARD AUTH FLOW =====");

const dashboardFiles = [
    "js/super-admin.js",
    "js/cooperative-admin.js",
    "modules/member-portal/member-portal.js"
];

for (const file of dashboardFiles) {
    const source = sources[file];

    console.log(`\n--- ${file} ---`);

    const authLines = linesContaining(source, [
        /onAuthStateChanged\s*\(/,
        /enforceDashboardAccess\s*\(/,
        /resolveAccess\s*\(/,
        /CMPAuth/,
        /currentUser\s*\(/,
        /normalizeRole/,
        /rolesMatch/,
        /window\.location/,
        /signOut\s*\(/
    ]);

    if (!authLines.length) {
        console.log("No matching auth-flow statements.");
        continue;
    }

    for (const item of authLines) {
        console.log(
            `${String(item.line).padStart(4)} | ${item.text.trim()}`
        );
    }
}

/* ============================================================
 * C. DIRECT ROLE DECISION SEARCH
 * ============================================================
 */

console.log("\n===== C: DASHBOARD DIRECT ROLE DECISION SEARCH =====");

const roleDecisionPatterns = [
    /normalizeRole\s*\(/,
    /rolesMatch\s*\(/,
    /\.profile\.role/,
    /\.role\s*===/,
    /\.role\s*!==/,
    /role\s*===\s*["']/,
    /role\s*!==\s*["']/
];

for (const file of dashboardFiles) {
    const source = sources[file];

    const matches = linesContaining(
        source,
        roleDecisionPatterns
    );

    console.log(
        `${file}: ${
            matches.length
        } direct role-decision references`
    );

    for (const item of matches) {
        console.log(
            `  ${item.line}: ${item.text.trim()}`
        );
    }
}

/* ============================================================
 * D. CMPAuth INTERNAL CAPABILITY VS CONSUMPTION
 * ============================================================
 */

console.log("\n===== D: CMPAUTH CAPABILITY / CONSUMPTION =====");

const cmpAuth = sources["js/components/auth.js"];
const registry = sources["js/core/serviceRegistry.js"];

console.log(
    `CMPAuth class definition: ${
        cmpAuth.includes("export class CMPAuth")
            ? "PRESENT"
            : "ABSENT"
    }`
);

console.log(
    `CMPAuth onChange implementation: ${
        cmpAuth.includes("static onChange")
            ? "PRESENT"
            : "ABSENT"
    }`
);

console.log(
    `serviceRegistry CMPAuth import: ${
        registry.includes("CMPAuth")
            ? "PRESENT"
            : "ABSENT"
    }`
);

console.log(
    `Live dashboard CMPAuth import: ${
        dashboardFiles.some(file =>
            sources[file].includes("CMPAuth")
        )
            ? "PRESENT"
            : "ABSENT"
    }`
);

/* ============================================================
 * E. CENTRAL CONTROLLER CONSUMER TRACE
 * ============================================================
 */

console.log("\n===== E: CENTRAL CONTROLLER CONSUMER TRACE =====");

for (const file of TARGETS) {
    const source = sources[file];

    if (
        source.includes("accessController.js") ||
        source.includes("enforceDashboardAccess")
    ) {
        console.log(`CENTRAL CONSUMER: ${file}`);
    }
}

/* ============================================================
 * F. DECISION
 * ============================================================
 */

console.log("\n===== F: RC406-D55R34 DECISION =====");

const dashboardUsesCentral =
    dashboardFiles.every(file =>
        sources[file].includes("enforceDashboardAccess")
    );

const dashboardUsesCmpAuth =
    dashboardFiles.some(file =>
        sources[file].includes("CMPAuth")
    );

const dashboardDirectRoleLogic =
    dashboardFiles.some(file =>
        linesContaining(
            sources[file],
            roleDecisionPatterns
        ).length > 0
    );

const registryUsesCmpAuth =
    registry.includes("CMPAuth");

console.log(
    `DASHBOARDS_USE_CENTRAL_ACCESS_CONTROLLER: ${
        dashboardUsesCentral ? "YES" : "NO"
    }`
);

console.log(
    `DASHBOARDS_DIRECTLY_CONSUME_CMPAUTH: ${
        dashboardUsesCmpAuth ? "YES" : "NO"
    }`
);

console.log(
    `DASHBOARDS_CONTAIN_DIRECT_ROLE_DECISION_LOGIC: ${
        dashboardDirectRoleLogic ? "YES" : "NO"
    }`
);

console.log(
    `SERVICE_REGISTRY_CONSUMES_CMPAUTH: ${
        registryUsesCmpAuth ? "YES" : "NO"
    }`
);

if (
    dashboardUsesCentral &&
    !dashboardUsesCmpAuth &&
    !dashboardDirectRoleLogic
) {
    console.log(`
DECISION:
CMPAUTH IS NOT A LIVE DASHBOARD AUTHORITY.

The dashboard runtimes delegate access decisions to the
Central Access Controller.

STATUS:
PASS — NO CONFIRMED AUTHORITY COMPETITION.
`);
} else {
    console.log(`
DECISION:
ADDITIONAL AUTHORITY / CONSUMER TRACE REQUIRED.

STATUS:
REVIEW REQUIRED.

NO PATCH APPLIED.
`);
}

console.log(`
============================================================
RC406-D55R34 COMPLETE
============================================================
`);
