/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Business Module: BM-006
 *
 * File: idService.js
 * Version: 1.0.0
 * =====================================================
 */

export class CMPIdService {

    /**
     * Generate a CMP ID
     */
    static generate(prefix) {

        const year = new Date().getFullYear();

        const sequence =
            String(Date.now()).slice(-6);

        return `ATC-${prefix}-${year}-${sequence}`;

    }

}