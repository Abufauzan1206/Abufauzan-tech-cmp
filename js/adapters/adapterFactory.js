/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Database Adapter Layer
 *
 * File: adapterFactory.js
 * Module: DA-003
 * Version: 2.0.0
 *
 * Runtime-Aware Adapter Factory
 * =====================================================
 */

import { CMPMemoryAdapter } from "./memoryAdapter.js";

const isNodeRuntime =
    typeof process !== "undefined" &&
    process.versions?.node;

let CMPFirebaseAdapter = null;

/*
 * Firebase must not be imported in Node.js because the
 * Firebase modules use browser HTTPS ESM imports.
 *
 * In the browser, load the Firebase adapter normally.
 */
if (!isNodeRuntime) {
    const firebaseModule =
        await import("./firebaseAdapter.js");

    CMPFirebaseAdapter =
        firebaseModule.CMPFirebaseAdapter;
}

export class CMPAdapterFactory {

    /**
     * Create the appropriate adapter for the current runtime.
     *
     * Node.js  → Memory Adapter
     * Browser  → Firebase Adapter
     */
    static firebase(collectionName) {

        if (isNodeRuntime) {

            return new CMPMemoryAdapter(
                collectionName
            );

        }

        return new CMPFirebaseAdapter(
            collectionName
        );
    }

    /**
     * Explicit in-memory adapter.
     *
     * Useful for tests and isolated business logic.
     */
    static memory(collectionName) {

        return new CMPMemoryAdapter(
            collectionName
        );
    }
}
