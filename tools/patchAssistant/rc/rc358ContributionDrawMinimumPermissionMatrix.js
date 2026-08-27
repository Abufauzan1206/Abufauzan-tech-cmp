import fs from "fs";

const rulesFile = "firestore.rules";

const collections = {
    drawGroups: {
        operations: [
            "create",
            "read",
            "update"
        ],
        fields: [
            "status",
            "createdAt",
            "groupId"
        ]
    },

    drawParticipants: {
        operations: [
            "create",
            "read"
        ],
        fields: [
            "groupId",
            "memberId",
            "status",
            "joinedAt"
        ]
    },

    drawBoxes: {
        operations: [
            "create",
            "read",
            "update"
        ],
        fields: [
            "groupId",
            "month",
            "year",
            "status",
            "picked",
            "pickedBy",
            "pickedAt",
            "locked",
            "lockedBy",
            "lockedAt",
            "participantId",
            "adminId"
        ]
    }
};

console.log("===============================================");
console.log("RC358 CONTRIBUTION-DRAW MINIMUM-PERMISSION MATRIX");
console.log("===============================================");

if (!fs.existsSync(rulesFile)) {
    console.log("firestore.rules: NOT FOUND");
    process.exit(1);
}

const rules = fs.readFileSync(rulesFile, "utf8");
const lines = rules.split("\n");

console.log("");
console.log("----- EXISTING ROLE FUNCTIONS -----");

const roleFunctions = [
    "isSuperAdmin",
    "isCooperativeAdmin",
    "isMember",
    "isMemberOfCooperative",
    "belongsToCooperative",
    "isOwnUserProfile"
];

for (const role of roleFunctions) {

    const found = lines
        .map((line, index) => ({ line, index }))
        .filter(({ line }) =>
            line.includes(`function ${role}(`)
        );

    console.log("");
    console.log(`${role}: ${found.length} occurrence(s)`);

    for (const item of found) {
        console.log(
            `  ${item.index + 1}: ${item.line.trim()}`
        );
    }
}

console.log("");
console.log("----- EXISTING RULE OWNERSHIP SIGNALS -----");

const ownershipSignals = [
    "request.auth",
    "resource.data",
    "request.resource.data",
    "memberId",
    "cooperativeId",
    "adminId",
    "createdBy",
    "userId"
];

for (const signal of ownershipSignals) {

    const found = lines
        .map((line, index) => ({ line, index }))
        .filter(({ line }) =>
            line.includes(signal)
        );

    console.log("");
    console.log(`${signal}: ${found.length} occurrence(s)`);

    for (const item of found) {
        console.log(
            `  ${item.index + 1}: ${item.line.trim()}`
        );
    }
}

console.log("");
console.log("===============================================");
console.log("RC358 PROPOSED MINIMUM-PERMISSION MATRIX");
console.log("===============================================");

for (const [collection, definition] of Object.entries(collections)) {

    console.log("");
    console.log(`COLLECTION: ${collection}`);

    for (const operation of definition.operations) {

        let proposedOwner = "UNRESOLVED";
        let rationale = "Requires verified application ownership semantics.";

        if (operation === "create") {

            if (collection === "drawGroups") {
                proposedOwner = "SUPER_ADMIN / COOPERATIVE_ADMIN";
                rationale =
                    "Group creation changes cooperative draw configuration.";
            }

            if (collection === "drawParticipants") {
                proposedOwner = "SUPER_ADMIN / COOPERATIVE_ADMIN";
                rationale =
                    "Participant enrollment changes draw membership.";
            }

            if (collection === "drawBoxes") {
                proposedOwner = "SUPER_ADMIN / COOPERATIVE_ADMIN";
                rationale =
                    "Box creation changes draw structure.";
            }
        }

        if (operation === "read") {

            if (collection === "drawGroups") {
                proposedOwner =
                    "SUPER_ADMIN / COOPERATIVE_ADMIN / AUTHORIZED DRAW MEMBER";
                rationale =
                    "Read access must correspond to the cooperative/draw ownership model.";
            }

            if (collection === "drawParticipants") {
                proposedOwner =
                    "SUPER_ADMIN / COOPERATIVE_ADMIN / AUTHORIZED DRAW MEMBER";
                rationale =
                    "Participant records are draw membership data.";
            }

            if (collection === "drawBoxes") {
                proposedOwner =
                    "SUPER_ADMIN / COOPERATIVE_ADMIN / AUTHORIZED DRAW MEMBER";
                rationale =
                    "Boxes are operational draw data.";
            }
        }

        if (operation === "update") {

            if (collection === "drawGroups") {
                proposedOwner =
                    "SUPER_ADMIN / COOPERATIVE_ADMIN";
                rationale =
                    "Group status changes affect draw administration.";
            }

            if (collection === "drawBoxes") {
                proposedOwner =
                    "SUPER_ADMIN / COOPERATIVE_ADMIN / AUTHORIZED PARTICIPANT";
                rationale =
                    "Box updates include assignment, reveal, reservation and swap state.";
            }
        }

        console.log("");
        console.log(`  OPERATION: ${operation}`);
        console.log(`  PROPOSED ACTOR: ${proposedOwner}`);
        console.log(`  RATIONALE: ${rationale}`);
    }

    console.log("");
    console.log(
        `  DOCUMENT FIELDS: ${definition.fields.join(", ")}`
    );
}

console.log("");
console.log("===============================================");
console.log("RC358 SECURITY BOUNDARIES");
console.log("===============================================");

console.log(
    "1. No blanket allow read/write for Draw collections."
);

console.log(
    "2. No authorization decision may rely solely on frontend role state."
);

console.log(
    "3. Cooperative ownership must be enforced server-side where the document schema supports it."
);

console.log(
    "4. Participant actions must not automatically receive administrative privileges."
);

console.log(
    "5. DrawBox state transitions must not permit arbitrary field ownership changes."
);

console.log(
    "6. Any final rule must preserve the existing super-admin/cooperative-admin/member model."
);

console.log("");
console.log("===============================================");
console.log("RC358 DECISION");
console.log("===============================================");

console.log(
    "RC358 FINDING: THE VERIFIED DRAW SCHEMA SUPPORTS A COLLECTION-SPECIFIC MINIMUM-PERMISSION MODEL, BUT FINAL FIRESTORE CONDITIONS MUST BE DERIVED FROM THE EXISTING ROLE FUNCTIONS AND ACTUAL COOPERATIVE OWNERSHIP RELATIONSHIPS."
);

console.log(
    "RC358 STATUS: NO FILES MODIFIED."
);

console.log(
    "RC358 NEXT DECISION: VERIFY THE EXISTING ROLE FUNCTIONS AND COOPERATIVE OWNERSHIP PATHS BEFORE WRITING DRAW FIRESTORE RULE BLOCKS."
);

console.log("");
console.log("===============================================");
console.log("RC358 AUDIT COMPLETE");
console.log("===============================================");
console.log("RC358: NO FILES MODIFIED");
