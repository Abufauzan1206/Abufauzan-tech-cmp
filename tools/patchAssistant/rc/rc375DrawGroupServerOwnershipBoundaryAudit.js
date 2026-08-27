import fs from "fs";

console.log("===============================================");
console.log("RC375 DRAW GROUP SERVER OWNERSHIP BOUNDARY AUDIT");
console.log("===============================================");

const files = [
    "functions/index.js",
    "js/services/drawGroupService.js",
    "js/services/drawParticipantService.js",
    "js/services/drawBoxService.js",
    "js/services/drawReservationService.js",
    "firestore.rules"
];

const patterns = [
    /drawGroup/i,
    /drawGroups/i,
    /create.*group/i,
    /groupId/i,
    /cooperativeId/i,
    /request\.auth/i,
    /request\.data/i,
    /users/i,
    /collection\(["']users["']\)/i,
    /doc\(["']users["']/i
];

for (const file of files) {
    if (!fs.existsSync(file)) {
        console.log("");
        console.log("MISSING:", file);
        continue;
    }

    const source = fs.readFileSync(file, "utf8");
    const lines = source.split("\n");

    console.log("");
    console.log("===============================================");
    console.log("FILE:", file);
    console.log("===============================================");

    const matched = [];

    lines.forEach((line, index) => {
        if (
            patterns.some(pattern =>
                pattern.test(line)
            )
        ) {
            matched.push(index);
        }
    });

    const unique = [
        ...new Set(matched)
    ];

    for (const index of unique) {
        console.log("");
        console.log(
            "===== " +
            file +
            ":" +
            (index + 1) +
            " ====="
        );

        const start = Math.max(
            0,
            index - 7
        );

        const end = Math.min(
            lines.length,
            index + 13
        );

        for (let i = start; i < end; i++) {
            console.log(
                (i + 1) +
                ": " +
                lines[i]
            );
        }
    }

    if (unique.length === 0) {
        console.log("No targeted references found.");
    }
}

console.log("");
console.log("===============================================");
console.log("RC375 DECISION");
console.log("===============================================");

console.log(
    "RC375 FINDING: IDENTIFY THE ACTUAL SERVER-SIDE DRAW-GROUP CREATION ENTRY POINT."
);

console.log(
    "RC375 SECURITY REQUIREMENT: DRAW-GROUP OWNERSHIP MUST RESOLVE FROM request.auth.uid -> users/{uid} -> cooperativeId."
);

console.log(
    "RC375 SECURITY REQUIREMENT: CLIENT-SUPPLIED cooperativeId MUST NOT OVERRIDE THE AUTHORITATIVE USER PROFILE."
);

console.log(
    "RC375 SECURITY REQUIREMENT: DO NOT CREATE ownerId, createdByUserId, OR ANY DUPLICATE OWNERSHIP FIELD."
);

console.log(
    "RC375 STATUS: NO APPLICATION OR FIRESTORE RULES MODIFIED."
);

console.log(
    "RC375 NEXT DECISION: PATCH ONLY THE SMALLEST SERVER-SIDE DRAW-GROUP OWNERSHIP RESOLUTION PATH AFTER THE CREATION ENTRY POINT IS CONFIRMED."
);

console.log("");
console.log("===============================================");
console.log("RC375 AUDIT COMPLETE");
console.log("===============================================");
