import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "js/business/idService.js",
        mode: "regex",
        search: String.raw`export class CMPIdService \{\s*/\*\*\s*\* Generate a CMP ID\s*\*/\s*static generate\(prefix\) \{\s*const year = new Date\(\)\.getFullYear\(\);\s*const sequence =\s*String\(Date\.now\(\)\)\.slice\(-6\);\s*return \`ATC-\$\{prefix\}-\$\{year\}-\$\{sequence\}\`;\s*\}\s*\}`,
        replace: `export class CMPIdService {
    /**
     * Last timestamp used to generate an ID.
     */
    static lastTimestamp = 0;

    /**
     * Monotonic sequence used when multiple IDs
     * are generated within the same millisecond.
     */
    static sequence = 0;

    /**
     * Generate a unique CMP ID.
     */
    static generate(prefix) {
        const year = new Date().getFullYear();
        const timestamp = Date.now();

        if (timestamp === this.lastTimestamp) {
            this.sequence += 1;
        } else {
            this.lastTimestamp = timestamp;
            this.sequence = 0;
        }

        const base = Number(String(timestamp).slice(-6));
        const sequence = String(
            (base + this.sequence) % 1000000
        ).padStart(6, "0");

        return \`ATC-\${prefix}-\${year}-\${sequence}\`;
    }
}`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC124 - UNIQUE CMP ID SERVICE PATCH");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC124 TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;
        console.log("=========================================");
        console.log("RC124 PATCH FAIL");
        console.log("=========================================");
        return;
    }

    console.log("=========================================");
    console.log("RC124 PATCH COMPLETE");
    console.log("=========================================");
}

run();
