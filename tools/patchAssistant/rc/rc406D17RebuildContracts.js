import fs from "fs/promises";
import { transaction } from "../patchEngine.js";

const scriptFile =
    "tools/patchAssistant/rc/rc406DrawGroupOwnershipPatch.js";

const sourceFile =
    "js/services/drawGroupService.js";

const scriptText =
    await fs.readFile(scriptFile, "utf8");

const sourceText =
    await fs.readFile(sourceFile, "utf8");

const functions = [
    "createDrawGroup",
    "getDrawGroups",
    "getDrawGroupById"
];

const blocks = [
    ...scriptText.matchAll(
        /\{\s*path:\s*"js\/services\/drawGroupService\.js",\s*search:\s*`([\s\S]*?)`,\s*replace:\s*`([\s\S]*?)`\s*\}/g
    )
];

if (blocks.length !== 5) {
    throw new Error(
        `Expected 5 drawGroupService patch blocks, found ${blocks.length}.`
    );
}

const patches = [];

for (let i = 0; i < 3; i++) {
    const functionName = functions[i];

    const startMarker =
        `export async function ${functionName}`;

    const start =
        sourceText.indexOf(startMarker);

    if (start === -1) {
        throw new Error(
            `Could not locate ${functionName} in source.`
        );
    }

    let end;

    if (i < 2) {
        const nextMarker =
            `export async function ${functions[i + 1]}`;

        end =
            sourceText.indexOf(nextMarker, start);
    } else {
        const nextMarker =
            "export async function updateGroupStatus";

        end =
            sourceText.indexOf(nextMarker, start);
    }

    if (end === -1) {
        throw new Error(
            `Could not locate end boundary for ${functionName}.`
        );
    }

    const exactSource =
        sourceText.slice(start, end).trim();

    const blockIndex =
        i + 2;

    const oldSearch =
        blocks[blockIndex][1];

    patches.push({
        path: scriptFile,
        search:
            `        search: \`${oldSearch}\`,`,
        replace:
            `        search: \`${exactSource}\`,`
    });
}

console.log("===============================================");
console.log("RC406-D17 REBUILD PATCH 3–5 SEARCH CONTRACTS");
console.log("===============================================");
console.log("PATCHES:", patches.length);

const result =
    await transaction(patches);

console.log(
    JSON.stringify(result, null, 2)
);

if (!result.success) {
    process.exitCode = 1;
}

console.log("===============================================");
console.log("RC406-D17 COMPLETE");
console.log("===============================================");
