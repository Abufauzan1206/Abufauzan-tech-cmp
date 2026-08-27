import fs from "fs";

console.log("===============================================");
console.log("RC374 AUTHORITATIVE COOPERATIVE PROFILE ASSIGNMENT AUDIT");
console.log("===============================================");

const targets = [
    "functions/index.js",
    "js/auth.js",
    "js/components/auth.js",
    "js/business/memberEngine.js",
    "js/services/memberService.js",
    "js/services/userService.js",
    "js/services/drawGroupService.js",
    "firestore.rules"
];

const patterns = [
    /cooperativeId/i,
    /setDoc/i,
    /updateDoc/i,
    /addDoc/i,
    /users/i,
    /members/i,
    /profile/i,
    /request\.auth/i
];

function printContext(file, lineNumber, lines) {
    console.log("");
    console.log("===== " + file + ":" + lineNumber + " =====");

    const start = Math.max(0, lineNumber - 8);
    const end = Math.min(
        lines.length,
        lineNumber + 12
    );

    for (let i = start; i < end; i++) {
        console.log(
            (i + 1) + ": " + lines[i]
        );
    }
}

for (const file of targets) {
    if (!fs.existsSync(file)) {
        console.log("");
        console.log("MISSING:", file);
        continue;
    }

    const source = fs.readFileSync(
        file,
        "utf8"
    );

    const lines = source.split("\n");

    console.log("");
    console.log("===============================================");
    console.log("FILE:", file);
    console.log("===============================================");

    let found = 0;

    lines.forEach((line, index) => {
        if (
            patterns.some(pattern =>
                pattern.test(line)
            )
        ) {
            printContext(
                file,
                index + 1,
                lines
            );
            found++;
        }
    });

    if (found === 0) {
        console.log("No targeted references found.");
    }
}

console.log("");
console.log("===============================================");
console.log("RC374 DECISION");
console.log("===============================================");

console.log(
    "RC374 FINDING: IDENTIFY THE EXACT CODE PATH THAT ASSIGNS cooperativeId TO THE AUTHORITATIVE USER/MEMBER PROFILE."
);

console.log(
    "RC374 SECURITY REQUIREMENT: THE DRAW GROUP MUST REUSE THAT EXISTING RELATIONSHIP."
);

console.log(
    "RC374 SECURITY REQUIREMENT: DO NOT CREATE ownerId, createdByUserId, OR ANOTHER DUPLICATE OWNERSHIP FIELD."
);

console.log(
    "RC374 SECURITY REQUIREMENT: DO NOT TRUST CLIENT-SUPPLIED cooperativeId WHEN A SERVER-VERIFIABLE PROFILE RELATIONSHIP EXISTS."
);

console.log(
    "RC374 STATUS: NO APPLICATION OR FIRESTORE RULES MODIFIED."
);

console.log(
    "RC374 NEXT DECISION: IF THE PROFILE ASSIGNMENT IS AUTHORITATIVE, PATCH ONLY THE SMALLEST DRAW-GROUP SERVER-SIDE OWNERSHIP RESOLUTION PATH."
);

console.log("");
console.log("===============================================");
console.log("RC374 AUDIT COMPLETE");
console.log("===============================================");
