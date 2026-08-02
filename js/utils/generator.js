/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Utility Generator
 *
 * File: generator.js
 * Version: 2.0.0
 * =====================================================
 */

export function generateCMPId(country) {

    const countryCodes = {
        Nigeria: "NG",
        Ghana: "GH",
        Kenya: "KE",
        "South Africa": "ZA",
        "United Kingdom": "GB",
        "United States": "US",
        Canada: "CA",
        India: "IN"
    };

    const code = countryCodes[country] || "XX";

    return "CMP-" + code + "-" + Date.now();

}


/**
 * Generate document numbers
 *
 * Example:
 * JRN-2026-000001
 * TRX-2026-000001
 * CON-2026-000001
 */

export function generateDocumentNumber(prefix, sequence = 1) {

    const year = new Date().getFullYear();

    return `${prefix}-${year}-${String(sequence).padStart(6, "0")}`;

}
