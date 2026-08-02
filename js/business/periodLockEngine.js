/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Business Module: BM-024
 *
 * File: periodLockEngine.js
 * Version: 1.0.0
 * =====================================================
 */

export class CMPPeriodLockEngine {

    static lockedPeriods = [];

    static lock(period) {

        if (this.lockedPeriods.includes(period)) {

            throw new Error(
                "Period already locked."
            );

        }

        this.lockedPeriods.push(period);

        return {

            period,

            status: "LOCKED",

            lockedAt: new Date()

        };

    }

    static unlock(period) {

        this.lockedPeriods =
            this.lockedPeriods.filter(

                p => p !== period

            );

        return {

            period,

            status: "UNLOCKED",

            unlockedAt: new Date()

        };

    }

    static isLocked(period) {

        return this.lockedPeriods.includes(period);

    }

}
