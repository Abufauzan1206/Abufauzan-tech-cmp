/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Business Module: BM-002
 *
 * File: memberIdService.js
 * Version: 1.0.0
 * =====================================================
 */

export class CMPMemberIdService {

/**
 * Generate a Member ID
 */
static generate() {

    const year = new Date().getFullYear();

    const sequence =
        String(Date.now()).slice(-6);

    return `ATC-MEM-${year}-${sequence}`;

}

}