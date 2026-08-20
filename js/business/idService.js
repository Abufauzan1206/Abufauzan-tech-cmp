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
     * Last timestamp used to generate an ID.
     */
    static lastTimestamp = 0;

    /**
     * Monotonic sequence used when multiple IDs
     * are generated within the same millisecond.
     */
    static sequence = 0;

    /**
     * Generate a unique CMP ID.
     */
    static generate(prefix) {
        const year = new Date().getFullYear();
        const timestamp = Date.now();

        if (timestamp === this.lastTimestamp) {
            this.sequence += 1;
        } else {
            this.lastTimestamp = timestamp;
            this.sequence = 0;
        }

        const base = Number(String(timestamp).slice(-6));
        const sequence = String(
            (base + this.sequence) % 1000000
        ).padStart(6, "0");

        return `ATC-${prefix}-${year}-${sequence}`;
    }
}