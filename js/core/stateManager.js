/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Core Module: CMP-049
 *
 * File: stateManager.js
 * Version: 1.0.0
 * =====================================================
 */

export class CMPStateManager {

    static state = {};

    /**
     * Set a state value
     */
    static set(key, value) {

        this.state[key] = value;

    }

    /**
     * Get a state value
     */
    static get(key) {

        return this.state[key];

    }

    /**
     * Check if a state exists
     */
    static has(key) {

        return key in this.state;

    }

    /**
     * Remove a state value
     */
    static remove(key) {

        delete this.state[key];

    }

    /**
     * Clear all state
     */
    static clear() {

        this.state = {};

    }

}