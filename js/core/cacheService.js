/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Core Module: CMP-044
 *
 * File: cacheService.js
 * Version: 1.0.0
 * =====================================================
 */

export class CMPCacheService {

    static cache = {};

    /**
     * Store data in cache
     */
    static set(key, value, ttl = null) {

    this.cache[key] = {

        value,

        expiresAt: ttl
            ? Date.now() + ttl
            : null

    };

}

    /**
     * Get cached data
     */
    static get(key) {

    const item = this.cache[key];

    if (!item) {

        return null;

    }

    if (

        item.expiresAt &&

        Date.now() > item.expiresAt

    ) {

        this.remove(key);

        return null;

    }

    return item.value;

}

    /**
     * Check if cache exists
     */
    static has(key) {

        return key in this.cache;

    }

    /**
     * Remove a cached item
     */
    static remove(key) {

        delete this.cache[key];

    }

    /**
     * Clear the entire cache
     */
    static clear() {

        this.cache = {};

    }

}