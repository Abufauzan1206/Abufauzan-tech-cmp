/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Business Engine Layer
 *
 * File: closingJournalPostingEngine.js
 * Version: 1.0.0
 *
 * Closing Journal Posting Engine
 * =====================================================
 */

import {
    CMPClosingJournalEngine
} from "./closingJournalEngine.js";

import {
    postJournal
} from "./journalPostingEngine.js";

export async function postClosingJournal(
    journalDate = new Date().toISOString().split("T")[0]
) {

    const closingJournal =
        await CMPClosingJournalEngine.generate();

    if (
        !closingJournal.entries ||
        closingJournal.entries.length === 0
    ) {

        return {
            success: true,
            posted: false,
            message:
                "No closing journal entries to post."
        };

    }

    const result =
        await postJournal({

            journalDate,

            description:
                "Year End Closing Journal",

            reference:
                "CLOSING-JOURNAL",

            entries:
                closingJournal.entries

        });

    return {

        success: true,

        closingJournal,

        postingResult: result

    };

}
