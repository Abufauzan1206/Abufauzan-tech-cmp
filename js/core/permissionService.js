/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Core Module: CMP-039
 *
 * File: permissionService.js
 * Version: 1.0.0
 * =====================================================
 */

export class CMPPermissionService {

    static permissions = [];

    /**
     * Set user permissions
     */
    static set(permissions) {

        this.permissions = Array.isArray(permissions)
            ? permissions
            : [];

    }

    /**
     * Get all permissions
     */
    static get() {

        return [...this.permissions];

    }

    /**
     * Check a permission
     */
    static has(permission) {

        return this.permissions.includes(permission);

    }

    /**
     * Clear permissions
     */
    static clear() {

        this.permissions = [];

    }

}