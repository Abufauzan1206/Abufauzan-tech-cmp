/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Database Adapter Layer
 *
 * File: adapterFactory.js
 * Module: DA-003
 * Version: 1.0.0
 *
 * Adapter Factory
 * =====================================================
 */

import { CMPFirebaseAdapter } from "./firebaseAdapter.js";
import { CMPMemoryAdapter } from "./memoryAdapter.js";


export class CMPAdapterFactory {


    static firebase(collectionName) {

        return new CMPFirebaseAdapter(collectionName);

    }


}
