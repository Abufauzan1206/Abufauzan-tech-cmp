import fs from "fs/promises";

const path = "js/services/drawGroupService.js";
const source = await fs.readFile(path, "utf8");

const oldBlock = `    });

    return group;
}

export async function updateGroupStatus`;

const newBlock = `    });

    if (!group) {
        throw new Error("Draw group not found");
    }

    return group;
}

export async function updateGroupStatus`;

if (!source.includes(oldBlock)) {
    throw new Error(
        "RC406-D35 PATCH ABORTED — expected getDrawGroupById return block not found"
    );
}

const updated = source.replace(oldBlock, newBlock);

await fs.writeFile(path, updated, "utf8");

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D35 — DRAW GROUP MISSING-GROUP PATCH");
console.log("===============================================");
console.log("PASS — missing-group rejection inserted");
console.log("===============================================");
console.log("RC406-D35 COMPLETE");
console.log("===============================================");
