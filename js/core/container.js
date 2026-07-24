/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Core Module: CMP-045
 *
 * File: container.js
 * Version: 1.0.0
 * =====================================================
 */

export class CMPContainer {

    static services = {};

    /**
     * Register a service
     */
    static register(name, service) {

    if (this.has(name)) {

        console.warn(
            `Service '${name}' is already registered.`
        );

        return;

    }

    this.services[name] = service;

}

    /**
     * Resolve a service
     */
    static resolve(name) {

        return this.services[name];

    }
    
    /**
 * Get all registered services
 */
static getAll() {

    return {

        ...this.services

    };

}

    /**
     * Check if a service exists
     */
    static has(name) {

        return name in this.services;

    }

    /**
     * Remove a service
     */
    static remove(name) {

        delete this.services[name];

    }

    /**
     * Clear all services
     */
    static clear() {

        this.services = {};

    }

}