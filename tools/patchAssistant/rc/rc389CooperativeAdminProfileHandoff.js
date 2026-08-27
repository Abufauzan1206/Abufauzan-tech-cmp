import fs from "fs";

const files = [
    "js/cooperative-admin.js",
    "js/services/drawGroupService.js",
    "cooperative-admin.html"
];

const patterns = [
    /userDoc/i,
    /userData/i,
    /profile/i,
    /cooperativeId/i,
    /createDrawGroup/i,
    /groupForm/i,
    /groupData/i,
    /createGroup/i,
    /drawGroup/i,
    /role/i,
    /auth\.currentUser/i,
    /getDoc/i
];

console.log("");
console.log("===============================================");
console.log("RC389 COOPERATIVE ADMIN PROFILE HANDOFF AUDIT");
console.log("===============================================");

for (const file of files) {

    if (!fs.existsSync(file)) {
        console.log("");
        console.log(`SKIP: ${file} not found.`);
        continue;
    }

    const source = fs.readFileSync(file, "utf8");
    const lines = source.split("\n");

    console.log("");
    console.log("===============================================");
    console.log(`FILE: ${file}`);
    console.log("===============================================");

    lines.forEach((line, index) => {

        if (
            patterns.some(pattern => pattern.test(line))
        ) {
            const start = Math.max(0, index - 5);
            const end = Math.min(
                lines.length,
                index + 6
            );

            console.log("");
            console.log(
                `--- context around line ${index + 1} ---`
            );

            for (let i = start; i < end; i++) {
                console.log(`${i + 1}: ${lines[i]}`);
            }
        }

    });
}

console.log("");
console.log("===============================================");
console.log("RC389 DECISION");
console.log("===============================================");

console.log(
    "ESTABLISH THE EXACT VARIABLE THAT HOLDS userDoc.data() IN THE COOPERATIVE ADMIN DASHBOARD."
);

console.log(
    "ESTABLISH WHETHER THAT SAME PROFILE OBJECT ALREADY CONTAINS cooperativeId."
);

console.log(
    "TRACE THE EXACT HANDOFF FROM THE COOPERATIVE ADMIN DASHBOARD TO createDrawGroup()."
);

console.log(
    "IF cooperativeId ALREADY EXISTS IN THE AUTHORITATIVE PROFILE, REUSE THAT VALUE."
);

console.log(
    "DO NOT CREATE ownerId, createdByUserId, OR ANY DUPLICATE OWNERSHIP FIELD."
);

console.log(
    "DO NOT DERIVE cooperativeId FROM uid, groupId, memberId, OR adminId."
);

console.log(
    "DO NOT MODIFY createDrawGroup(), cooperative-admin.js, OR FIRESTORE RULES YET."
);

console.log(
    "RC389 STATUS: AUDIT ONLY — NO FILES MODIFIED."
);

console.log("");
console.log("===============================================");
console.log("RC389 AUDIT COMPLETE");
console.log("===============================================");
