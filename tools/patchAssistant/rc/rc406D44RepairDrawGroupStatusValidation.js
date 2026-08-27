import fs from "fs/promises";
import { transaction } from "../patchEngine.js";

const path = "js/services/drawGroupService.js";
const source = await fs.readFile(path, "utf8");

const createStart = source.indexOf(
`export async function createDrawGroup(
    groupData
) {`
);

if (createStart === -1) {
    throw new Error("createDrawGroup block not found.");
}

const profileMarker = `
    const profile =
        await getCurrentUserProfile();
`;

const createProfileIndex = source.indexOf(
    profileMarker,
    createStart
);

if (createProfileIndex === -1) {
    throw new Error(
        "createDrawGroup profile lookup not found."
    );
}

const createPrefix = source.slice(
    createStart,
    createProfileIndex
);

const cleanedCreatePrefix = `
export async function createDrawGroup(
    groupData
) {
`;

const createOldPrefix = source.slice(
    createStart,
    createProfileIndex
);

const createPatch = {
    path,
    search: createOldPrefix,
    replace: cleanedCreatePrefix
};

const result = await transaction([
    createPatch
]);

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D44 — DRAW GROUP STATUS VALIDATION REPAIR");
console.log("===============================================");
console.log(JSON.stringify(result, null, 2));

if (!result.success) {
    process.exitCode = 1;
}

console.log("===============================================");
console.log("RC406-D44 COMPLETE");
console.log("===============================================");
