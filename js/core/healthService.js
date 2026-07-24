/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Core Module: CMP-047
 *
 * File: healthService.js
 * Version: 1.0.0
 * =====================================================
 */

export class CMPHealthService {

    static startedAt = new Date();

    static status = {

        framework: "healthy",

        firebase: "unknown",

        authentication: "unknown",

        cache: "healthy",

        services: "healthy"

    };

    /**
     * Get overall system status
     */
    static getStatus() {

        return {

            ...this.status

        };

    }

    /**
     * Update a health indicator
     */
    static update(key, value) {

        this.status[key] = value;

    }

    /**
     * Get system uptime (milliseconds)
     */
    static getUptime() {

        return Date.now() - this.startedAt.getTime();

    }
    
    /**
 * Reset all health indicators
 */
static reset() {

    this.status = {

        framework: "healthy",

        firebase: "unknown",

        authentication: "unknown",

        cache: "healthy",

        services: "healthy"

    };

}

/**
 * Check whether all systems are healthy
 */
static isHealthy() {

    return Object.values(this.status)

        .every(status => status === "healthy");

}

}