/**
 * =========================================
 * ABUFAUZAN TECH CMP
 * RC074 ACCOUNTING PERIOD REOPEN JOURNAL
 * POSTING TEST PATCH
 * =========================================
 */

import fs from "fs/promises";

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC074 ACCOUNTING PERIOD REOPEN JOURNAL");
    console.log("POSTING TEST PATCH");
    console.log("=========================================");

    const source =
        "testAccountingPeriodReopenJournalPosting.html";

    const target =
        "testAccountingPeriodReopenJournalPosting.js";

    try {
        const html = await fs.readFile(source, "utf8");

        const match = html.match(
            /<script type="module">([\s\S]*?)<\/script>/
        );

        if (!match) {
            throw new Error(
                "Could not extract module script from HTML test."
            );
        }

        let content = match[1].trim();

        content = content
            .replace(
                /const output\s*=\s*document\.getElementById\("output"\);/,
                ""
            )
            .replace(
                /const testSuffix\s*=\s*Date\.now\(\);/,
                "const testSuffix = Date.now();"
            )
            .replace(
                /let report\s*=\s*"";/,
                "let report = \"\";"
            );

        content = content.replace(
            /report \+=\s*"POST AFTER REOPEN: PASS\\\\n";/,
            'report += "POST AFTER REOPEN: PASS\\\\n";'
        );

        content = content.replace(
            /report \+=\s*"RC074 TEST COMPLETE: PASS";/,
            'report += "RC074 TEST COMPLETE: PASS";'
        );

        const outputCode = `
console.log(report);
`;

        content += outputCode;

        await fs.writeFile(target, content + "\n", "utf8");

        console.log("CREATE FILE: PASS");
        console.log("TARGET:", target);

        await fs.access(target);

        console.log("VERIFY: PASS");
        console.log("=========================================");
        console.log("RC074 PATCH COMPLETE");
        console.log("=========================================");
    } catch (error) {
        console.error("PATCH FAIL");
        console.error(error.message);
        process.exit(1);
    }
}

run();
