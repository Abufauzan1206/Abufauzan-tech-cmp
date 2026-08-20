/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Business Module: BM-020
 *
 * File: statementOfChangesInEquityEngine.js
 * Version: 1.0.0
 * =====================================================
 */

import {
    generateIncomeExpenditure
} from "./incomeExpenditureEngine.js";

export class CMPStatementOfChangesInEquityEngine {

    static async generate({

        openingEquity = 0,

        memberCapital = 0,

        adjustments = 0

    } = {}) {

        const incomeStatement =
            await generateIncomeExpenditure();

        const surplus =
            incomeStatement.netSurplus;

        const closingEquity =

            openingEquity +

            memberCapital +

            surplus +

            adjustments;

        return {

            openingEquity,

            memberCapital,

            currentSurplus: surplus,

            adjustments,

            closingEquity

        };

    }

}
