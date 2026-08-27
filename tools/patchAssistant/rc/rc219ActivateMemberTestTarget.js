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
console.log("RC219 — LOCATE AUTHORITATIVE RC201 MEMBER TEST TARGET");
console.log("==================================================");

const candidates = walk(ROOT).filter(file => {
    const relative = path.relative(ROOT, file);

    /*
     * RC201 is the authoritative member-registration
     * persistence verification target.
     *
     * Patch Engine infrastructure is never a valid target.
     */
    if (
        relative.startsWith("tools/patchAssistant/") &&
        relative !==
            "tools/patchAssistant/rc/rc201MemberRegistrationPersistenceVerification.js"
    ) {
        return false;
    }

    /*
     * Deterministic authoritative target.
     * Do not rely on obsolete RC190 markers or fragile
     * heading text.
     */
    if (
        relative ===
        "tools/patchAssistant/rc/rc201MemberRegistrationPersistenceVerification.js"
    ) {
        return true;
    }

    return false;
});

console.log("AUTHORITATIVE RC201 CANDIDATES:");

for (const candidate of candidates) {
    console.log(
        " -",
        path.relative(ROOT, candidate)
    );
}

if (candidates.length === 0) {
    console.error("");
    console.error(
        "RC219 ERROR: Authoritative RC201 member test source could not be located."
    );
    process.exitCode = 1;
    process.exit();
}

if (candidates.length > 1) {
    console.error("");
    console.error(
        "RC219 ERROR: Multiple authoritative RC201 candidates found."
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
 * RC219 canonical-target contract:
 *
 * RC201 is the authoritative member-registration persistence
 * verification target. It uses memberService directly:
 *
 *   registerMember
 *   getMemberById
 *   deleteMember
 *
 * Therefore RC219 must NOT attempt the obsolete RC190
 * MemoryAdapter import/constructor repair against RC201.
 */
const canonicalRC201 =
    target ===
        "tools/patchAssistant/rc/rc201MemberRegistrationPersistenceVerification.js" &&
    source.includes(
        'from "../../../js/services/memberService.js";'
    ) &&
    source.includes("registerMember") &&
    source.includes("getMemberById") &&
    source.includes("deleteMember");

if (canonicalRC201) {
    console.log(
        "RC219: AUTHORITATIVE RC201 MEMBER SERVICE CONTRACT CONFIRMED."
    );
    console.log(
        "RC219: OBSOLETE RC190 MEMORYADAPTER REPAIR SKIPPED."
    );
    console.log("RC219 MEMBER TEST TARGET: PASS");
    process.exit(0);
}

console.error(
    "RC219 ERROR: Target is not the authoritative RC201 member-service contract."
);
process.exitCode = 1;
process.exit();

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
