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


        case "normalized": {

            const normalize = text =>
                text.replace(
                    /\\s+/g,
                    " "
                ).trim();

            const normalizedSearch =
                normalize(search);


            const normalizedContent =
                normalize(content);


            const index =
                normalizedContent.indexOf(
                    normalizedSearch
                );


            if (index === -1) {

                throw new Error(
                    "Normalized replacement target not found."
                );

            }


            const originalStart =
                content.indexOf(
                    search.trim().split(
                        /\\s+/
                    )[0]
                );


            if (originalStart === -1) {

                throw new Error(
                    "Unable to map normalized match."
                );

            }


            return content.replace(
                content.substring(
                    originalStart,
                    originalStart +
                    search.length
                ),
                replacement
            );

        }

        case "regex":

            return content.replace(
                new RegExp(search, "m"),
                replacement
            );

        default:

            throw new Error(
                `Unsupported matching strategy: ${match.strategy}`
            );
    }

}
