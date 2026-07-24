/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Core Module: CMP-041
 *
 * File: auditService.js
 * Version: 1.0.0
 * =====================================================
 */

export class CMPAuditService {

    static logs = [];

    /**
     * Record an audit event
     */
    static log({

        action,

        user = null,

        organization = null,

        details = null,

        timestamp = new Date()

    }) {

        this.logs.unshift({

    id: crypto.randomUUID(),

    action,

    user,

    organization,

    details,

    timestamp

});
    }

    /**
     * Get all logs
     */
    static getAll() {

        return [...this.logs];

    }

    /**
     * Clear audit logs
     */
    static clear() {

        this.logs = [];

    }

}