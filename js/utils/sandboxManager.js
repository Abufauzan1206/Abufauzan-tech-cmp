/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Financial Validation Framework
 *
 * File: sandboxManager.js
 * Version: 1.0.0
 *
 * Sandbox Session Manager
 * =====================================================
 */

import {
    generateSandboxId
} from "./generator.js";

let currentSandbox = null;

export function startSandbox(sequence = 1) {

    currentSandbox = {
        sandboxId: generateSandboxId(sequence),
        status: "ACTIVE",
        startedAt: new Date().toISOString()
    };

    return currentSandbox;

}

export function getCurrentSandbox() {

    return currentSandbox;

}

export function isSandboxActive() {

    return (
        currentSandbox !== null &&
        currentSandbox.status === "ACTIVE"
    );

}

export function endSandbox() {

    if (currentSandbox) {

        currentSandbox.status = "CLOSED";
        currentSandbox.endedAt =
            new Date().toISOString();

    }

    return currentSandbox;

}
