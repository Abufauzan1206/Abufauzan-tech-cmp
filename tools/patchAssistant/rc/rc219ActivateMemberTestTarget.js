/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC219 — ACTIVATE MEMBER TEST TARGET
 *
 * Purpose:
 * Locate the ACTIVE RC190 member test source and align
 * its MemoryAdapter import/constructor with the actual
 * named export:
 *
 *   import { CMPMemoryAdapter }
 *       from "./js/adapters/memoryAdapter.js";
 *
 * MUST execute through Patch Engine.
 * =====================================================
 */

import fs from "fs";
import path from "path";
import { transaction } from "../patchEngine.js";

const ROOT = process.cwd();

function walk(dir) {
    const results = [];

    for (const entry of fs.readdirSync(dir, {
        withFileTypes: true
    })) {
        if (
            entry.name === "node_modules" ||
            entry.name === ".git" ||
            entry.name.endsWith(".bak")
        ) {
            continue;
        }

        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            results.push(...walk(fullPath));
        } else if (entry.isFile() && entry.name.endsWith(".js")) {
            results.push(fullPath);
        }
    }

    return results;
}

console.log("==================================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC219 — LOCATE ACTIVE RC190 TEST TARGET");
console.log("==================================================");

const candidates = walk(ROOT).filter(file => {
    const relative = path.relative(ROOT, file);

    /*
     * Never inspect Patch Engine infrastructure itself.
     * RC219 must discover the real member test source,
     * not another patch script containing RC190 strings.
     */
    if (
        relative.startsWith("tools/patchAssistant/") ||
        relative === "tools/patchAssistant/rc/rc219ActivateMemberTestTarget.js"
    ) {
        return false;
    }

    const source = fs.readFileSync(file, "utf8");

    return (
        source.includes("RC190 MEMBER REGISTRATION END-TO-END") ||
        source.includes('fullName: "RC190 Test Member"') ||
        source.includes('phoneNumber: "08000000190"')
    );
});

console.log("RC190 CANDIDATES:");

for (const candidate of candidates) {
    console.log(
        " -",
        path.relative(ROOT, candidate)
    );
}

if (candidates.length === 0) {
    console.error("");
    console.error(
        "RC219 ERROR: Active RC190 test source could not be located."
    );
    process.exitCode = 1;
    process.exit();
}

if (candidates.length > 1) {
    console.error("");
    console.error(
        "RC219 ERROR: Multiple RC190 candidates found."
    );
    console.error(
        "Do not patch until the active target is uniquely identified."
    );
    process.exitCode = 1;
    process.exit();
}

const target = path.relative(
    ROOT,
    candidates[0]
);

console.log("");
console.log("ACTIVE TARGET:");
console.log(target);
console.log("");

const source = fs.readFileSync(
    candidates[0],
    "utf8"
);

const patches = [];

/*
 * Legacy default import:
 *
 * import { CMPMemoryAdapter } from "./js/adapters/memoryAdapter.js";
 */
if (
    /import\s+MemoryAdapter\s+from\s+["'][^"']*memoryAdapter\.js["'];/.test(
        source
    )
) {
    patches.push({
        path: target,
        mode: "regex",
        search:
            `import\\s+MemoryAdapter\\s+from\\s+["'][^"']*memoryAdapter\\.js["'];`,
        replace:
            `import { CMPMemoryAdapter } from "./js/adapters/memoryAdapter.js";`
    });
}

/*
 * Legacy constructor usage.
 */
if (
    /new\s+MemoryAdapter\s*\(/.test(source)
) {
    patches.push({
        path: target,
        mode: "regex",
        search: `new\\s+MemoryAdapter\\s*\\(`,
        replace: `new CMPMemoryAdapter(`
    });
}

/*
 * Already correctly imported and constructed.
 */
if (patches.length === 0) {
    const alreadyCorrect =
        source.includes(
            `import { CMPMemoryAdapter } from "./js/adapters/memoryAdapter.js";`
        ) &&
        !/new\s+MemoryAdapter\s*\(/.test(source);

    if (alreadyCorrect) {
        console.log(
            "RC219: TARGET ALREADY USES CMPMemoryAdapter CONTRACT."
        );
        console.log(
            "RC219 MEMBER TEST TARGET: PASS"
        );
        process.exit(0);
    }

    console.error(
        "RC219 ERROR: Target found, but no safe MemoryAdapter contract pattern matched."
    );
    process.exitCode = 1;
    process.exit();
}

console.log(
    "PATCH COUNT:",
    patches.length
);
console.log("");

const result = await transaction(patches);

console.log("TRANSACTION RESULT:");
console.log(
    JSON.stringify(result, null, 2)
);
console.log("");

if (!result.success) {
    console.log(
        "RC219 MEMBER TEST TARGET: FAIL"
    );
    process.exitCode = 1;
} else {
    console.log(
        "RC219 MEMBER TEST TARGET: PASS"
    );
}

console.log("==================================================");
