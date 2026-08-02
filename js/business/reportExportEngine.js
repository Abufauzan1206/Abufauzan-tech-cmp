/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Business Module: BM-026
 *
 * File: reportExportEngine.js
 * Version: 1.0.0
 * =====================================================
 */

export class CMPReportExportEngine {

    static build({

        title,

        period,

        generatedBy = "SYSTEM",

        data = []

    }) {

        return {

            cooperative:

                "ABUFAUZAN TECH Cooperative Management Platform",

            title,

            period,

            generatedBy,

            generatedAt:

                new Date(),

            totalRecords:

                data.length,

            data

        };

    }

}
