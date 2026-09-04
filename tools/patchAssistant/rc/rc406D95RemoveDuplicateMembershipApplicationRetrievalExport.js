import fs from "fs";
import { patch } from "../patchEngine.js";

const targetPath = "functions/index.js";
const source = fs.readFileSync(targetPath, "utf8");

const marker = "exports.getPendingMembershipApplications = onCall(async (request) => {";
const matches = [...source.matchAll(new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"))];

if (matches.length !== 2) {
    console.error(
        "RC406-D95: expected exactly 2 duplicate D68 exports; found",
        matches.length
    );
    process.exit(1);
}

const secondStart = matches[1].index;

const d69Marker = "/**\n * RC406-D69";
const d69Start = source.indexOf(d69Marker, secondStart);

if (d69Start === -1) {
    console.error(
        "RC406-D95: RC406-D69 boundary not found after second D68 export"
    );
    process.exit(1);
}

const duplicateBlock = source.slice(secondStart, d69Start);

if (!duplicateBlock.includes(marker)) {
    console.error("RC406-D95: extracted duplicate block is invalid");
    process.exit(1);
}

const result = await patch({
    path: targetPath,
    mode: "exact",
    search: duplicateBlock,
    replace: ""
});

console.log(
    "RC406-D95 PATCH RESULT:",
    JSON.stringify(result, null, 2)
);

if (!result?.success) {
    process.exit(1);
}

console.log(
    "RC406-D95 DUPLICATE MEMBERSHIP APPLICATION RETRIEVAL EXPORT REMOVAL: PASS"
);
