/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Core Module: CMP-052
 *
 * File: frameworkDiagnostics.js
 * Version: 1.0.0
 * =====================================================
 */

import { CMP } from "./app.js";

export class CMPFrameworkDiagnostics {

    /**
     * Run framework diagnostics
     */
    static run() {

        console.group(
            "CMP Framework Diagnostics"
        );

        console.log(
            "Initialized:",
            CMP.initialized
        );

        console.log(
            "Services:",
            Object.keys(CMP.services)
        );

        console.log(
            "Modules:",
            Object.keys(CMP.modules)
        );

        console.log(
            "Framework Version:",
            CMP.version
        );

        console.groupEnd();

    }

}