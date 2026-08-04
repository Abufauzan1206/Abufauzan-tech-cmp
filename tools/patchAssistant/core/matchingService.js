/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Developer Tools
 *
 * File: matchingService.js
 * Version: 2.0.0
 *
 * Patch Matching Service
 * =====================================================
 */

export function findMatch(
    content,
    search,
    options = {}
) {

    const {
        ignoreWhitespace = false
    } = options;


    if (content.includes(search)) {

        return {

            found: true,

            strategy: "exact",

            search

        };

    }


    if (!ignoreWhitespace) {

        return {

            found: false

        };

    }


    const normalize = text =>
        text.replace(/\s+/g, " ").trim();


    if (
        normalize(content).includes(
            normalize(search)
        )
    ) {

        return {

            found: true,

            strategy: "normalized",

            search

        };

    }


    return {

        found: false

    };

}
