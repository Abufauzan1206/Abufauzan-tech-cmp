/**
 * =====================================================
 * ABUFAUZAN TECH CMP
 * RC038 - FIX CLOSING JOURNAL POSTING API
 * =====================================================
 */

import fs from "fs";

const file =
    "js/business/closingJournalPostingEngine.js";

function patch() {

    const source =
        fs.readFileSync(file, "utf8");

    let text = source;

    text = text.replace(
        /await postJournal\(\{[\s\S]*?journalDate,[\s\S]*?description:\s*"Year End Closing Journal",[\s\S]*?reference:\s*"CLOSING-JOURNAL",[\s\S]*?entries:\s*closingJournal\.entries[\s\S]*?\}\);/,
        `await postJournal({
        date:
            journalDate,
        title:
            "Year End Closing Journal",
        reference:
            "CLOSING-JOURNAL",
        entries:
            closingJournal.entries
    });`
    );

    if (text === source) {

        throw new Error(
            "No expected closing journal posting API pattern was changed."
        );

    }

    fs.copyFileSync(
        file,
        file + ".bak"
    );

    fs.writeFileSync(
        file,
        text
    );

    return {

        success: true,

        backup:
            file + ".bak",

        strategy:
            "regex-exact"

    };

}

try {

    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC038 - FIX CLOSING JOURNAL POSTING API");
    console.log("=========================================");

    console.log("");

    console.log(
        "PATCH:",
        file
    );

    const result =
        patch();

    console.log(result);

    console.log("");

    console.log(
        "RC038 PATCH: PASS"
    );

} catch (error) {

    console.log(
        "RC038 PATCH: FAIL"
    );

    console.log(
        error.message
    );

}
