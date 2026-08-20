/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Developer Tools
 *
 * File: validationService.js
 * Version: 2.0.0
 *
 * Patch Validation Service
 * =====================================================
 */

export function validatePatchRequest(data) {

    if (!data) {

        throw new Error(
            "Patch request is required."
        );

    }


    if (!data.path) {

        throw new Error(
            "File path is required."
        );

    }


    if (
        data.mode !== "create" &&
        data.mode !== "empty" &&
        !data.search
    ) {
        throw new Error(
            "Search text is required."
        );
    }


    if (data.replace == null) {

        throw new Error(
            "Replacement text is required."
        );

    }


    return true;

}
