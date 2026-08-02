/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Business Module: BM-021
 *
 * File: financialYearEngine.js
 * Version: 1.0.0
 * =====================================================
 */

export class CMPFinancialYearEngine {

    static currentYear = new Date().getFullYear();

    static closedYears = [];

    static close(year = this.currentYear) {

        if (this.closedYears.includes(year)) {

            throw new Error(
                "Financial year already closed."
            );

        }

        this.closedYears.push(year);

        return {

            year,

            status: "CLOSED",

            closedAt: new Date()

        };

    }

    static isClosed(year = this.currentYear) {

        return this.closedYears.includes(year);

    }

    static reopen(year) {

        this.closedYears =
            this.closedYears.filter(

                y => y !== year

            );

        return {

            year,

            status: "REOPENED",

            reopenedAt: new Date()

        };

    }

}
