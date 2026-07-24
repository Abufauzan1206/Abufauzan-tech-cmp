/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Core Module: CMP-043
 *
 * File: configService.js
 * Version: 1.0.0
 * =====================================================
 */

export class CMPConfigService {

    static config = {

        appName:
            "ABUFAUZAN TECH CMP",

        version:
            "2.0.0-dev",

        environment:
            "development",

        currency:
            "₦",

        language:
            "en",

        theme:
            "light",

        dateFormat:
            "DD/MM/YYYY",

        rowsPerPage:
            10

    };

    /**
     * Get a configuration value
     */
    static get(key) {

        return this.config[key];

    }

    /**
     * Update a configuration value
     */
    static set(key, value) {

        this.config[key] = value;

    }

    /**
     * Get all configuration
     */
    static getAll() {

        return {

            ...this.config

        };

    }
    
    /**
 * Get logs by level
 */
static getByLevel(level) {

    return this.logs.filter(

        log => log.level === level

    );

}

/**
 * Get latest logs
 */
static latest(limit = 10) {

    return this.logs.slice(0, limit);

}

/**
 * Count log entries
 */
static count() {

    return this.logs.length;

}
    
    /**
 * Reset configuration to defaults
 */
static reset() {

    this.config = {

        appName:
            "ABUFAUZAN TECH CMP",

        version:
            "2.0.0-dev",

        environment:
            "development",

        currency:
            "₦",

        language:
            "en",

        theme:
            "light",

        dateFormat:
            "DD/MM/YYYY",

        rowsPerPage:
            10

    };

}

/**
 * Get a configuration value with a fallback
 */
static getOrDefault(key, defaultValue) {

    return this.config[key] ?? defaultValue;

}

}