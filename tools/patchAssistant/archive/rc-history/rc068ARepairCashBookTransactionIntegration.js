import fs from "fs/promises";

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC068A - REPAIR CASH BOOK INTEGRATION PATCH");
    console.log("=========================================");

    const path =
        "tools/patchAssistant/rc/rc068CashBookTransactionIntegration.js";

    let content = await fs.readFile(path, "utf8");

    const broken = String.raw`\`Test: \${path}\``;

    if (!content.includes(broken)) {
        throw new Error(
            "Expected broken template literal was not found."
        );
    }

    content = content.replace(
        broken,
        "`Test: ${path}`"
    );

    await fs.writeFile(path, content, "utf8");
    await fs.access(path);

    console.log("REPAIR: PASS");
    console.log("RC068 PATCH FILE REPAIRED");
    console.log("=========================================");
    console.log("RC068A PATCH COMPLETE");
    console.log("=========================================");
}

run().catch(error => {
    console.error("PATCH FAIL");
    console.error(error);
    process.exit(1);
});
