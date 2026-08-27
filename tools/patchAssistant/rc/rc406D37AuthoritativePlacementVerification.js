import fs from "fs/promises";
import crypto from "crypto";

const path = "js/services/drawGroupService.js";
const source = await fs.readFile(path, "utf8");

const createStart = source.indexOf(
    "export async function createDrawGroup"
);
const getGroupsStart = source.indexOf(
    "export async function getDrawGroups"
);
const updateStart = source.indexOf(
    "export async function updateGroupStatus"
);

if (
    createStart === -1 ||
    getGroupsStart === -1 ||
    updateStart === -1
) {
    throw new Error(
        "RC406-D37 VERIFICATION ABORTED — authoritative function boundaries not found."
    );
}

const createBlock = source.slice(createStart, getGroupsStart);
const getGroupsBlock = source.slice(getGroupsStart, updateStart);
const updateBlock = source.slice(updateStart);

const validationMarker =
    'if (typeof status !== "string")';

const createHasValidation =
    createBlock.includes(validationMarker);

const getGroupsHasValidation =
    getGroupsBlock.includes(validationMarker);

const updateHasValidation =
    updateBlock.includes(validationMarker);

const trimMarker =
    "status = status.trim();";

const updateHasTrim =
    updateBlock.includes(trimMarker);

if (createHasValidation) {
    throw new Error(
        "RC406-D37 FAIL — status validation remains inside createDrawGroup."
    );
}

if (getGroupsHasValidation) {
    throw new Error(
        "RC406-D37 FAIL — status validation remains inside getDrawGroups."
    );
}

if (!updateHasValidation) {
    throw new Error(
        "RC406-D37 FAIL — status validation is missing from updateGroupStatus."
    );
}

if (!updateHasTrim) {
    throw new Error(
        "RC406-D37 FAIL — status normalization is missing from updateGroupStatus."
    );
}

const hash = crypto
    .createHash("sha256")
    .update(source)
    .digest("hex");

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D37 — AUTHORITATIVE VALIDATION PLACEMENT VERIFICATION");
console.log("===============================================");
console.log("PASS — createDrawGroup has no status validation");
console.log("PASS — getDrawGroups has no status validation");
console.log("PASS — updateGroupStatus contains status validation");
console.log("PASS — updateGroupStatus normalizes status");
console.log("PASS — authoritative function boundaries confirmed");
console.log("PASS — production source hash generated");
console.log("");
console.log("=== PRODUCTION SOURCE HASH ===");
console.log(hash);
console.log("===============================================");
console.log("RC406-D37 RESULT: PASS");
console.log("===============================================");
console.log("RC406-D37 COMPLETE");
console.log("===============================================");
