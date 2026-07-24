/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Core Module: CMP-037
 *
 * File: serviceRegistry.js
 * Version: 1.0.0
 * =====================================================
 */

import { CMP } from "./app.js";

import { CMPAuth } from "../components/auth.js";

import { CMPNotification } from "../components/notification.js";

import { CMPOrganizationService } from "./organizationService.js";

import { CMPPermissionService } from "./permissionService.js";

import { CMPSessionService } from "./sessionService.js";

import { CMPAuditService } from "./auditService.js";

import { CMPEventBus } from "./eventBus.js";

import { CMPConfigService } from "./configService.js";

import { CMPCacheService } from "./cacheService.js";

import { CMPContainer } from "./container.js";

import { CMPLoggerService } from "./loggerService.js";

import { CMPHealthService } from "./healthService.js";

import { CMPSchedulerService } from "./schedulerService.js";

import { CMPStateManager } from "./stateManager.js";

export class CMPServiceRegistry {

    static register(name, service) {

    CMP.registerService(
        name,
        service
    );

    CMPContainer.register(
        name,
        service
    );

}

    static get(name) {

        return CMP.getService(name);

    }
    
    /**
 * Get all state values
 */
static getAll() {

    return {

        ...this.state

    };

}

/**
 * Set multiple state values
 */
static setMany(values) {

    Object.assign(

        this.state,

        values

    );

}

/**
 * Count state entries
 */
static count() {

    return Object.keys(

        this.state

    ).length;

}
    
    static initialize() {

    this.register(
        "auth",
        CMPAuth
    );

    this.register(
        "notifications",
        CMPNotification
    );
    
    this.register(
    "organization",
    CMPOrganizationService
);

this.register(
    "permissions",
    CMPPermissionService
);

this.register(
    "session",
    CMPSessionService
);

this.register(
    "audit",
    CMPAuditService
);

this.register(
    "events",
    CMPEventBus
);

this.register(
    "config",
    CMPConfigService
);

this.register(
    "cache",
    CMPCacheService
);

this.register(
    "logger",
    CMPLoggerService
);

this.register(
    "health",
    CMPHealthService
);

this.register(
    "scheduler",
    CMPSchedulerService
);

this.register(
    "state",
    CMPStateManager
);

    console.log(
        "Core services registered."
    );

}

}