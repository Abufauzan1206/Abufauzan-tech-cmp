/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Developer Tools
 *
 * File: generator.js
 * Version: 1.0.0
 *
 * Code Generator Engine
 * =====================================================
 */

import fs from "fs/promises";


export async function generateFromTemplate(

    templatePath,
    outputPath,
    replacements = {}

) {

    let content =
        await fs.readFile(
            templatePath,
            "utf8"
        );


    for (const [key, value] of Object.entries(replacements)) {

        const placeholder =
            `{{${key}}}`;

        content =
            content.replaceAll(
                placeholder,
                value
            );

    }


    await fs.writeFile(
        outputPath,
        content,
        "utf8"
    );


    return {

        success: true,

        output:
            outputPath,

        message:
            "File generated successfully."

    };

}
