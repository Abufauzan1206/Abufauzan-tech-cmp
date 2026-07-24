/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Core Module: CMP-051
 *
 * File: frameworkInitializer.js
 * Version: 1.0.0
 * =====================================================
 */

import { CMPServiceRegistry } from "./serviceRegistry.js";
import { CMPLoggerService } from "./loggerService.js";
import { CMPHealthService } from "./healthService.js";
import { CMPFrameworkDiagnostics }
    from "./frameworkDiagnostics.js";
    
    import { CMPFrameworkDiagnostics }
    from "./frameworkDiagnostics.js";

export class CMPFrameworkInitializer {

    /**
     * Initialize the CMP Framework
     */
    static async initialize() {

        CMPLoggerService.log(
            "info",
            "Starting framework initialization..."
        );

        CMPServiceRegistry.initialize();

        CMPHealthService.update(
            "services",
            "healthy"
        );

        CMPLoggerService.log(
            "info",
            "Framework initialization completed."
        );
        
        CMPFrameworkDiagnostics.run();

    }

}