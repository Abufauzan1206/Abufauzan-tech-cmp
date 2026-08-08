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
    ignoreWhitespace = false,
    mode = "exact"
} = options;

if (mode === "regex") {

    const regex =
        new RegExp(search, "m");

    return {

        found:
            regex.test(content),

        strategy:
            "regex",

        search

    };

}
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
