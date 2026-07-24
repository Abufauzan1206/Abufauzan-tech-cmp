/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Core Framework
 *
 * File: app.js
 * Module: CMP Core Application Controller
 * Version: 2.0.0-dev
 * =====================================================
 */
 import { CMPFrameworkInitializer } from "./frameworkInitializer.js";
 
import { CMPLoggerService } from "./loggerService.js";

class CMPApp {

    constructor() {

        this.name = "ABUFAUZAN TECH CMP";

        this.version = "2.0.0-dev";

        this.environment = "development";

        this.initialized = false;
        
this.services = {};

this.modules = {};

this.user = null;

this.organization = null;

    }


    /**
     * Initialize CMP Platform
     */
   async init() {

    try {

        await this.loadFramework();

        this.initialized = true;

        CMPLoggerService.log(
    "info",
    "CMP Framework initialized successfully."
);

    } catch (error) {

        this.handleError(error);

    }

}


    /**
     * Load core framework components
     */
    async loadFramework() {

    await CMPFrameworkInitializer.initialize();
    
        /*
            Future loading sequence:

            1. Firebase
            2. Authentication
            3. Session Manager
            4. Organization Context
            5. Permission Engine
            6. Notification Service

        */

    }
    
    /**
 * Register a core service
 */
registerService(name, service) {

    this.services[name] = service;

}

/**
 * Get a registered service
 */
getService(name) {

    return this.services[name];

}

/**
 * Register a platform module
 */
registerModule(name, module) {

    this.modules[name] = module;

}

/**
 * Get a registered module
 */
getModule(name) {

    return this.modules[name];

}

    /**
     * Global error handler
     */
    handleError(error) {


        console.error(
            "CMP Framework Error:",
            error
        );


    }

}


// Create global CMP application instance

export const CMP = new CMPApp();


// Auto start application

CMP.init();