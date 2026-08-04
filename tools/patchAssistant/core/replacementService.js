/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Developer Tools
 *
 * File: replacementService.js
 * Version: 2.0.0
 *
 * Patch Replacement Service
 * =====================================================
 */

export function replaceContent(
    content,
    search,
    replacement,
    match
) {

    if (!match?.found) {

        throw new Error(
            "No valid match found."
        );

    }


    switch (match.strategy) {

        case "exact":

            return content.replace(
                search,
                replacement
            );


        case "normalized":

            throw new Error(
                "Whitespace-tolerant replacement is not yet implemented."
            );


        default:

            throw new Error(
                `Unsupported matching strategy: ${match.strategy}`
            );

    }

}
