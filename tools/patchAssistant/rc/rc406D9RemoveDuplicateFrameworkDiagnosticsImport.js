import fs from "fs";
import { patch } from "../patchEngine.js";

const path = "js/core/frameworkInitializer.js";
const source = fs.readFileSync(path, "utf8");

const importPattern =
/^[ \t]*import[ \t]*\{[ \t]*CMPFrameworkDiagnostics[ \t]*\}[ \t]*\n[ \t]*from[ \t]*["']\.\/frameworkDiagnostics\.js["'];[ \t]*$/gm;

const matches = [...source.matchAll(importPattern)];

console.log("==================================================");
console.log("RC406-PATCH-9B — DUPLICATE DIAGNOSTICS IMPORT REPAIR");
console.log("==================================================");
console.log("TARGET:", path);
console.log("DIAGNOSTICS_IMPORT_OCCURRENCES:", matches.length);

if (matches.length !== 2) {
    throw new Error(
        `RC406-D9B refused: expected exactly 2 diagnostics imports, found ${matches.length}.`
    );
}

const firstImport = matches[0][0];
const secondImport = matches[1][0];

console.log("\n=== FIRST IMPORT ===");
console.log(firstImport);

console.log("\n=== SECOND IMPORT TARGET ===");
console.log(secondImport);

/*
 * Safety invariant:
 * The first import must be the authoritative unindented import.
 * The second must be the duplicate.
 */
if (!firstImport.startsWith("import {")) {
    throw new Error(
        "RC406-D9B refused: first diagnostics import does not have expected authoritative form."
    );
}

if (!secondImport.startsWith("    import {")) {
    throw new Error(
        "RC406-D9B refused: second diagnostics import does not have expected duplicate indentation."
    );
}

/*
 * Use the exact source text of the second occurrence.
 */
const result = await patch({
    path,
    mode: "exact",
    search: secondImport,
    replace: ""
});

console.log("\nPATCH_RESULT:", result);
console.log("==================================================");
console.log("RC406-PATCH-9B — DUPLICATE IMPORT REPAIR COMPLETE");
console.log("==================================================");
