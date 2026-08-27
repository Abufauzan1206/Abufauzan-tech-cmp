import { transaction } from "../patchEngine.js";

const repairs = [
    {
        path: "js/services/drawGroupService.js",
        search: `    groupData.createdAt =
        serverTimestamp();

export async function getDrawGroups() {`,
        replace: `    groupData.createdAt =
        serverTimestamp();

    const docRef =
        await addDoc(
            collection(
                db,
                "drawGroups"
            ),
            groupData
        );

    return docRef.id;
}

export async function getDrawGroups() {`
    }
];

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D23 — RESTORE CREATE DRAW GROUP CLOSURE");
console.log("===============================================");

const result = await transaction(repairs);

console.log(
    JSON.stringify(result, null, 2)
);

if (!result.success) {
    process.exitCode = 1;
}

console.log("===============================================");
console.log("RC406-D23 COMPLETE");
console.log("===============================================");
