/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Developer Tools
 *
 * File: patchEngine.js
 * Version: 1.0.0
 *
 * Patch Engine
 * =====================================================
 */

import {
    applyPatch
} from "./patchService.js";

export async function patch(data) {

    const result =
        await applyPatch(data);

    return result;

}
