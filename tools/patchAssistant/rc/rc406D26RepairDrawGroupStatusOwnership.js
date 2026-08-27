import fs from "fs/promises";
import { transaction } from "../patchEngine.js";

const path = "js/services/drawGroupService.js";
const source = await fs.readFile(path, "utf8");

const startMarker =
    "export async function updateGroupStatus(";

const start = source.indexOf(startMarker);

if (start === -1) {
    console.error("RC406-D26 PRECHECK: updateGroupStatus export not found.");
    process.exitCode = 1;
}

const nextExport = source.indexOf(
    "export async function ",
    start + startMarker.length
);

if (nextExport !== -1) {
    console.error(
        "RC406-D26 PRECHECK: unexpected following export boundary."
    );
    process.exitCode = 1;
}

const functionSource = source.slice(start);

const hasOwnershipGuard =
    /groupData\.cooperativeId\s*!==\s*profile\.cooperativeId/.test(
        functionSource
    );

if (hasOwnershipGuard) {
    console.log(
        "RC406-D26 PRECHECK: ownership guard already present."
    );
    console.log(
        "RC406-D26 RESULT: PASS — NO PATCH REQUIRED"
    );
    process.exit(0);
}

const updateDocMarker = "    await updateDoc(";
const markerIndex = functionSource.indexOf(updateDocMarker);

if (markerIndex === -1) {
    console.error(
        "RC406-D26 PRECHECK: updateDoc anchor not found inside updateGroupStatus."
    );
    process.exitCode = 1;
}

const guard = `    const profile =
        await getCurrentUserProfile();

    if (
        profile.role !== "super_admin" &&
        profile.role !== "cooperative_admin"
    ) {
        throw new Error(
            "Only authorized administrators can update draw group status."
        );
    }

    const groupRef = doc(
        db,
        "drawGroups",
        groupId
    );

    const groupSnap =
        await getDoc(groupRef);

    if (!groupSnap.exists()) {
        throw new Error(
            "Draw group not found."
        );
    }

    const groupData =
        groupSnap.data();

    if (
        profile.role === "cooperative_admin" &&
        groupData.cooperativeId !== profile.cooperativeId
    ) {
        throw new Error(
            "Cooperative administrator cannot update a draw group owned by another cooperative."
        );
    }

`;

const absoluteMarkerIndex =
    start + markerIndex;

const repairs = [
    {
        path,
        search: source.slice(
            absoluteMarkerIndex,
            absoluteMarkerIndex + updateDocMarker.length
        ),
        replace:
            guard + updateDocMarker
    }
];

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D26R — DRAW GROUP STATUS OWNERSHIP REPAIR");
console.log("===============================================");

const result = await transaction(repairs);

console.log(JSON.stringify(result, null, 2));

if (!result.success) {
    process.exitCode = 1;
}

console.log("===============================================");
console.log("RC406-D26R COMPLETE");
console.log("===============================================");
