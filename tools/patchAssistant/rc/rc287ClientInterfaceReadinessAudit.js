/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC287 — CLIENT INTERFACE READINESS AUDIT
 *
 * Diagnostic only.
 * Does not modify production files.
 * =====================================================
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "../../..");

const targets = [
    "login.html",
    "dashboard.html",
    "cooperative-admin.html",
    "super-admin.html",
    "modules/members/index.html",
    "modules/contributions/index.html",
    "modules/welfare/index.html",
    "modules/member-registration/index.html",
    "js/auth.js",
    "js/components/auth.js",
    "js/components/roleAuthorization.js",
    "js/navigation/sidebar.js",
    "js/navigation/menu-data.js"
];

console.log("==================================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC287 — CLIENT INTERFACE READINESS AUDIT");
console.log("==================================================");

let missing = 0;

for (const relative of targets) {
    const fullPath = path.join(ROOT, relative);

    console.log("");
    console.log(`===== ${relative} =====`);

    if (!fs.existsSync(fullPath)) {
        console.log("FAIL — NOT FOUND");
        missing++;
        continue;
    }

    const stat = fs.statSync(fullPath);
    console.log(`PASS — EXISTS`);
    console.log(`TYPE: ${stat.isFile() ? "FILE" : "OTHER"}`);
    console.log(`SIZE: ${stat.size} bytes`);

    if (!stat.isFile()) continue;

    const content = fs.readFileSync(fullPath, "utf8");

    const checks = [
        ["script references", /<script\b/i],
        ["navigation/sidebar reference", /sidebar|navigation/i],
        ["authentication reference", /auth|login|session|role/i],
        ["dashboard reference", /dashboard/i],
        ["cooperative admin reference", /cooperative.?admin|cooperative admin/i],
        ["member reference", /member/i],
        ["module links", /modules\//i]
    ];

    for (const [label, pattern] of checks) {
        console.log(
            `${pattern.test(content) ? "PASS" : "INFO"} — ${label}`
        );
    }
}

console.log("");
console.log("===== AUTHENTICATION ROLE DEFINITIONS =====");

const authPath = path.join(ROOT, "js/components/auth.js");

if (fs.existsSync(authPath)) {
    const auth = fs.readFileSync(authPath, "utf8");

    for (const role of [
        "isSuperAdmin",
        "isCooperativeAdmin",
        "isMember"
    ]) {
        console.log(
            `${auth.includes(role) ? "PASS" : "FAIL"} — ${role}`
        );
    }
} else {
    console.log("FAIL — js/components/auth.js missing");
}

console.log("");
console.log("===== ROLE AUTHORIZATION =====");

const rolePath = path.join(
    ROOT,
    "js/components/roleAuthorization.js"
);

if (fs.existsSync(rolePath)) {
    const roleAuth = fs.readFileSync(rolePath, "utf8");

    for (const role of [
        "super_admin",
        "cooperative_admin",
        "member"
    ]) {
        console.log(
            `${roleAuth.includes(role) ? "PASS" : "FAIL"} — role: ${role}`
        );
    }
} else {
    console.log("FAIL — roleAuthorization.js missing");
}

console.log("");
console.log("===== DASHBOARD AVAILABILITY WARNING =====");

const authJs = path.join(ROOT, "js/auth.js");

if (fs.existsSync(authJs)) {
    const content = fs.readFileSync(authJs, "utf8");

    if (/not yet available/i.test(content)) {
        console.log(
            "WARNING — authentication currently contains a 'not yet available' dashboard path"
        );
    } else {
        console.log(
            "PASS — no 'not yet available' dashboard warning detected"
        );
    }
}

console.log("");
console.log("===== NAVIGATION MENU =====");

const menuPath = path.join(
    ROOT,
    "js/navigation/menu-data.js"
);

if (fs.existsSync(menuPath)) {
    const menu = fs.readFileSync(menuPath, "utf8");

    for (const item of [
        "Dashboard",
        "Register Cooperative",
        "Cooperatives",
        "Members"
    ]) {
        console.log(
            `${menu.includes(item) ? "PASS" : "INFO"} — ${item}`
        );
    }
} else {
    console.log("FAIL — menu-data.js missing");
}

console.log("");
console.log("===== SUMMARY =====");

console.log(
    missing === 0
        ? "PASS — all expected client interface files exist"
        : `FAIL — ${missing} expected interface file(s) missing`
);

console.log("");
console.log("==================================================");
console.log("RC287 CLIENT INTERFACE READINESS AUDIT COMPLETE");
console.log("==================================================");
