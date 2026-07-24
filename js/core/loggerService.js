/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Core Module: CMP-046
 *
 * File: loggerService.js
 * Version: 1.0.0
 * =====================================================
 */

export class CMPLoggerService {

    static logs = [];

    /**
     * Write a log entry
     */
    static log(level, message, data = null) {

        const entry = {

            id: crypto.randomUUID(),

            level,

            message,

            data,

            timestamp: new Date()

        };

        this.logs.unshift(entry);

        console[level]?.(message, data);

    }

    /**
     * Get all logs
     */
    static getAll() {

        return [...this.logs];

    }

    /**
     * Clear logs
     */
    static clear() {

        this.logs = [];

    }

}