import fs from "fs";

console.log("===============================================");
console.log("RC384 COOPERATIVE ADMIN PROFILE SOURCE TRACE");
console.log("===============================================");

const files = [
    "modules/contribution-draw/create-group/script.js",
    "js/components/auth.js",
    "js/components/roleAuthorization.js",
    "js/services/userService.js",
    "js/services/cooperativeService.js",
    "firestore.rules"
];

const patterns = [
    /userProfile/i,
    /cooperativeId/i,
    /currentUser/i,
    /auth\.currentUser/i,
    /onAuthStateChanged/i,
    /doc\(.*users/i,
    /getDoc/i,
    /getDocs/i,
    /role/i
];

for (const file of files) {
    if (!fs.existsSync(file)) continue;

    const lines = fs.readFileSync(file, "utf8").split("\n");

    const matches = [];

    lines.forEach((line, index) => {
        if (patterns.some(pattern => pattern.test(line))) {
            matches.push(index);
        }
    });

    if (matches.length === 0) continue;

    console.log("");
    console.log("===============================================");
    console.log(`PROFILE SOURCE CONTEXT: ${file}`);
    console.log("===============================================");

    const shown = new Set();

    for (const index of matches) {
        const start = Math.max(0, index - 8);
        const end = Math.min(lines.length, index + 9);

        for (let i = start; i < end; i++) {
            if (shown.has(i)) continue;

            shown.add(i);
            console.log(`${i + 1}: ${lines[i]}`);
        }

        console.log("");
    }
}

console.log("");
console.log("===============================================");
console.log("RC384 DECISION RULE");
console.log("===============================================");

console.log(
    "IDENTIFY THE AUTHORITATIVE CURRENT USER PROFILE SOURCE."
);

console.log(
    "CONFIRM WHERE cooperativeId IS READ FROM userProfile().data.cooperativeId OR ITS AUTHORITATIVE APPLICATION EQUIVALENT."
);

console.log(
    "TRACE WHETHER THE CREATE-GROUP PAGE CAN ACCESS THAT AUTHORITATIVE PROFILE WITHOUT INVENTING A NEW OWNERSHIP SOURCE."
);

console.log(
    "DO NOT CREATE ownerId, createdByUserId, OR ANY DUPLICATE OWNERSHIP FIELD."
);

console.log(
    "DO NOT DERIVE cooperativeId FROM uid, groupId, memberId, OR adminId."
);

console.log(
    "DO NOT MODIFY FIRESTORE RULES UNTIL THE APPLICATION OWNERSHIP CONTRACT IS ESTABLISHED."
);

console.log(
    "RC384 STATUS: AUDIT ONLY — NO FILES MODIFIED."
);

console.log("");
console.log("===============================================");
console.log("RC384 AUDIT COMPLETE");
console.log("===============================================");
