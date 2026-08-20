import fs from "fs/promises";

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC067A - REPAIR CASH BOOK TEST PATCH");
    console.log("=========================================");

    const path =
        "tools/patchAssistant/rc/rc067CashBookEngineTest.js";

    let content = await fs.readFile(path, "utf8");

    const broken = String.raw`\`Test: \${path}\``;
    const fixed = "Test: ${path}";

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
    console.log("RC067 PATCH FILE REPAIRED");
    console.log("=========================================");
    console.log("RC067A PATCH COMPLETE");
    console.log("=========================================");
}

run().catch(error => {
    console.error("PATCH FAIL");
    console.error(error);
    process.exit(1);
});
