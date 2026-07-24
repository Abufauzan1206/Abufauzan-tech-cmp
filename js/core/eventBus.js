/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Core Module: CMP-042
 *
 * File: eventBus.js
 * Version: 1.0.0
 * =====================================================
 */

export class CMPEventBus {

    static listeners = {};

    /**
     * Subscribe to an event
     */
    static on(event, callback) {

        if (!this.listeners[event]) {

            this.listeners[event] = [];

        }

        this.listeners[event].push(callback);

    }
    
    /**
 * Remove an event listener
 */
static off(event, callback) {

    if (!this.listeners[event]) {

        return;

    }

    this.listeners[event] =
        this.listeners[event].filter(
            listener => listener !== callback
        );

}

    /**
     * Emit an event
     */
    static emit(event, payload = null) {

        if (!this.listeners[event]) {

            return;

        }

        this.listeners[event].forEach(callback => {

            callback(payload);

        });

    }
    
    /**
 * Remove all listeners
 */
static clear() {

    this.listeners = {};

}

}