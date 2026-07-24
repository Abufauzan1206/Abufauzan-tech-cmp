/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Core Module: CMP-038
 *
 * File: organizationService.js
 * Version: 1.0.0
 * =====================================================
 */

export class CMPOrganizationService {

    static organization = null;

    /**
     * Set the active organization
     */
    static set(organization) {

        this.organization = organization;

    }

    /**
     * Get the active organization
     */
    static get() {

        return this.organization;

    }

    /**
     * Check if an organization is active
     */
    static hasOrganization() {

        return this.organization !== null;

    }

    /**
     * Clear the active organization
     */
    static clear() {

        this.organization = null;

    }

}