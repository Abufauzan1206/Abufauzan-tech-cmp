import fs from "fs";

const serviceFile =
    "js/services/drawParticipantService.js";

const callerFile =
    "modules/contribution-draw/group-participants/script.js";

const service = fs.readFileSync(
    serviceFile,
    "utf8"
);

const caller = fs.readFileSync(
    callerFile,
    "utf8"
);

console.log("===============================================");
console.log("RC332 DRAW PARTICIPANT CALLER CONTEXT AUDIT");
console.log("===============================================");

console.log("");
console.log("----- SERVICE IMPORTS -----");

console.log(
    service
        .split("\n")
        .slice(0, 20)
        .join("\n")
);

console.log("");
console.log("----- PARTICIPANT SERVICE CONTRACT -----");

const serviceMatch = service.match(
    /export\s+async\s+function\s+addParticipantToGroup[\s\S]*?(?=\nexport\s|\s*$)/
);

console.log(
    serviceMatch
        ? serviceMatch[0]
        : "addParticipantToGroup function not found."
);

console.log("");
console.log("----- CALLER IMPORT / SETUP -----");

const callerLines = caller.split("\n");

console.log(
    callerLines
        .slice(0, 40)
        .map((line, index) =>
            `${index + 1}: ${line}`
        )
        .join("\n")
);

console.log("");
console.log("----- CALLER AROUND addParticipantToGroup -----");

const callIndex = callerLines.findIndex(
    line => line.includes("addParticipantToGroup(")
);

if (callIndex === -1) {
    console.log(
        "addParticipantToGroup call not found."
    );
} else {
    const start = Math.max(0, callIndex - 35);
    const end = Math.min(
        callerLines.length,
        callIndex + 45
    );

    console.log(
        callerLines
            .slice(start, end)
            .map((line, index) =>
                `${start + index + 1}: ${line}`
            )
            .join("\n")
    );
}

console.log("");
console.log("----- CALLER TRUST SIGNALS -----");

for (const signal of [
    "auth.currentUser",
    "currentUser",
    "memberId",
    "cooperativeId",
    "participantId",
    "groupId",
    "user.uid"
]) {
    console.log(
        `${signal}: ${
            caller.includes(signal)
                ? "PRESENT"
                : "ABSENT"
        }`
    );
}

console.log("");
console.log("----- CONTRACT DECISION -----");

const hasAuth =
    /auth\.currentUser|currentUser|user\.uid/.test(
        caller
    );

const hasMemberId =
    /\bmemberId\b/.test(caller);

const hasCooperativeId =
    /\bcooperativeId\b/.test(caller);

const hasGroupId =
    /\bgroupId\b/.test(caller);

if (hasAuth && hasMemberId) {
    console.log(
        "RC332 FINDING: CALLER ALREADY CARRIES AUTH/MEMBER CONTEXT."
    );
    console.log(
        "RC332 STATUS: SERVICE SHOULD DERIVE OWNERSHIP FROM AUTH."
    );
} else if (hasMemberId && hasGroupId) {
    console.log(
        "RC332 FINDING: CALLER SUPPLIES MEMBER + GROUP CONTEXT."
    );
    console.log(
        "RC332 STATUS: VERIFY WHETHER MEMBER SELF-JOIN OR ADMIN ASSIGNMENT."
    );
} else {
    console.log(
        "RC332 FINDING: CALLER CONTEXT REQUIRES FURTHER REVIEW."
    );
    console.log(
        "RC332 STATUS: DO NOT PATCH SERVICE CONTRACT YET."
    );
}

console.log("");
console.log("===============================================");
console.log("RC332 AUDIT COMPLETE");
console.log("===============================================");
console.log("RC332: NO FILES MODIFIED");
