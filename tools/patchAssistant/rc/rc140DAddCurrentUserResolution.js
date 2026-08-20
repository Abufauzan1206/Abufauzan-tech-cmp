/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC140D - ADD CURRENT USER HISTORY RESOLUTION
 *
 * Purpose:
 * Ensure protected dashboard history re-entry explicitly
 * resolves the current Firebase authentication user.
 *
 * Production files modified through Patch Engine only.
 *
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "js/super-admin.js",
        mode: "text",
        search: `function handleDashboardHistoryReentry() {
    window.addEventListener("popstate", () => {`,
        replace: `function handleDashboardHistoryReentry() {
    const currentUser = auth.currentUser;

    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }

    window.addEventListener("popstate", () => {`
    },
    {
        path: "js/cooperative-admin.js",
        mode: "text",
        search: `function handleDashboardHistoryReentry() {
    window.addEventListener("popstate", () => {`,
        replace: `function handleDashboardHistoryReentry() {
    const currentUser = auth.currentUser;

    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }

    window.addEventListener("popstate", () => {`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC140D - ADD CURRENT USER HISTORY RESOLUTION");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC140D TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC140D PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC140D PATCH COMPLETE");
    console.log("=========================================");
}

run();
