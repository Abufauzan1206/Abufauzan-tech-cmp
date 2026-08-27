import fs from "fs";

console.log("===============================================");
console.log("RC384 AUTHORITATIVE COOPERATIVE PROFILE SOURCE TRACE");
console.log("===============================================");

const targets = [
    "functions/index.js",
    "js/auth.js",
    "js/components/auth.js",
    "js/services/userService.js",
    "js/services/memberService.js",
    "js/business/memberEngine.js",
    "modules/contribution-draw/create-group/script.js",
    "firestore.rules"
];

const patterns = [
    /cooperativeId/i,
    /cooperativeID/i,
    /cooperative/i,
    /userProfile/i,
    /profile/i,
    /users/i,
    /members/i,
    /auth\.currentUser/i,
    /getAuth/i,
    /currentUser/i,
    /request\.auth/i,
    /request\.data/i
];

for (const file of targets) {
    if (!fs.existsSync(file)) {
        console.log("");
        console.log("MISSING:", file);
        continue;
    }

    const lines = fs.readFileSync(file, "utf8").split("\n");

    console.log("");
    console.log("===============================================");
    console.log("FILE:", file);
    console.log("===============================================");

    const matches = [];

    lines.forEach((line, index) => {
        if (
            patterns.some(pattern => pattern.test(line))
        ) {
            matches.push(index);
        }
    });

    for (const index of matches) {
        console.log("");
        console.log(
            `===== ${file}:${index + 1} =====`
        );

        const start = Math.max(0, index - 8);
        const end = Math.min(
            lines.length,
            index + 12
        );

        for (let i = start; i < end; i++) {
            console.log(`${i + 1}: ${lines[i]}`);
        }
    }
}

console.log("");
console.log("===============================================");
console.log("RC384 DECISION RULE");
console.log("===============================================");

console.log(
    "IDENTIFY THE EXISTING AUTHORITATIVE SOURCE OF cooperativeId."
);

console.log(
    "PREFER AN EXISTING USER/COOPERATIVE PROFILE CONTRACT."
);

console.log(
    "DO NOT PATCH createDrawGroup() YET."
);

console.log(
    "DO NOT CREATE ownerId, createdByUserId, OR ANY DUPLICATE OWNERSHIP FIELD."
);

console.log(
    "DO NOT DERIVE cooperativeId FROM uid, groupId, memberId, OR adminId."
);

console.log(
    "RC384 STATUS: AUDIT ONLY — NO APPLICATION OR FIRESTORE RULES MODIFIED."
);

console.log("");
console.log("===============================================");
console.log("RC384 AUDIT COMPLETE");
console.log("===============================================");
