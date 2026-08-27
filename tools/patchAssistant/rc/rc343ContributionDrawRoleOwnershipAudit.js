import fs from "fs";

const file = "js/navigation/sidebar.js";

console.log("===============================================");
console.log("RC343 CONTRIBUTION-DRAW ROLE OWNERSHIP AUDIT");
console.log("===============================================");

if (!fs.existsSync(file)) {
    console.log(`FILE NOT FOUND: ${file}`);
    process.exit(1);
}

const content = fs.readFileSync(file, "utf8");
const lines = content.split("\n");

console.log("");
console.log("----- ROLE FUNCTION STRUCTURE -----");

lines.forEach((line, index) => {
    if (
        /function|const\s+\w+\s*=|return\s+\[|rolesMatch/.test(line)
    ) {
        console.log(`${index + 1}: ${line.trim()}`);
    }
});

console.log("");
console.log("----- CONTRIBUTION-DRAW OCCURRENCES -----");

const drawLines = [];

lines.forEach((line, index) => {
    if (/contribution-draw|Contribution Draw/.test(line)) {
        drawLines.push(index);
        console.log(`${index + 1}: ${line.trim()}`);
    }
});

console.log("");
console.log("----- ROLE CONTEXT FOR EACH CONTRIBUTION-DRAW OCCURRENCE -----");

for (const index of drawLines) {
    const start = Math.max(0, index - 30);
    const end = Math.min(lines.length, index + 31);

    console.log("");
    console.log(
        `========== CONTEXT AROUND LINE ${index + 1} ==========`
    );

    for (let i = start; i < end; i++) {
        console.log(`${i + 1}: ${lines[i].trim()}`);
    }
}

console.log("");
console.log("----- ROLE-SPECIFIC DRAW DETECTION -----");

const rolePatterns = {
    super_admin: /super_admin/,
    cooperative_admin: /cooperative_admin/,
    member: /\bmember\b/
};

for (const [role, pattern] of Object.entries(rolePatterns)) {
    console.log("");
    console.log(`ROLE: ${role}`);

    const roleIndexes = [];

    lines.forEach((line, index) => {
        if (pattern.test(line)) {
            roleIndexes.push(index);
        }
    });

    if (!roleIndexes.length) {
        console.log("ROLE REFERENCES: NONE");
        continue;
    }

    for (const roleIndex of roleIndexes) {
        const start = Math.max(0, roleIndex - 5);
        const end = Math.min(lines.length, roleIndex + 16);

        const nearbyDraw = lines
            .slice(start, end)
            .some(line =>
                /contribution-draw|Contribution Draw/.test(line)
            );

        console.log(
            `role reference line ${roleIndex + 1}: nearby Contribution Draw = ${
                nearbyDraw ? "YES" : "NO"
            }`
        );
    }
}

console.log("");
console.log("----- DIRECT ROLE-TO-DRAW WINDOWS -----");

for (let i = 0; i < lines.length; i++) {
    if (/rolesMatch\s*\(/.test(lines[i])) {
        const start = Math.max(0, i);
        const end = Math.min(lines.length, i + 45);

        const windowText = lines
            .slice(start, end)
            .join("\n");

        if (/contribution-draw|Contribution Draw/.test(windowText)) {
            console.log("");
            console.log(
                `ROLE BRANCH STARTING NEAR LINE ${i + 1}`
            );

            for (let j = start; j < end; j++) {
                console.log(
                    `${j + 1}: ${lines[j].trim()}`
                );
            }
        }
    }
}

console.log("");
console.log("----- RC343 DECISION -----");

const hasDraw = /contribution-draw/.test(content);

const hasSuperAdmin = /rolesMatch\s*\(\s*role\s*,\s*["']super_admin["']\s*\)/.test(
    content
);

const hasCooperativeAdmin = /rolesMatch\s*\(\s*role\s*,\s*["']cooperative_admin["']\s*\)/.test(
    content
);

const hasMember = /rolesMatch\s*\(\s*role\s*,\s*["']member["']\s*\)/.test(
    content
);

if (
    hasDraw &&
    hasSuperAdmin &&
    hasCooperativeAdmin &&
    hasMember
) {
    console.log(
        "RC343 FINDING: ROLE-SPECIFIC SIDEBAR CONTRACT EXISTS, BUT CONTRIBUTION-DRAW OWNERSHIP MUST BE DETERMINED FROM THE BRANCH CONTEXT ABOVE."
    );

    console.log(
        "RC343 STATUS: DO NOT PATCH GROUP-PARTICIPANTS OR ITS SERVICE UNTIL CONTRIBUTION-DRAW ROLE OWNERSHIP IS ESTABLISHED."
    );
} else {
    console.log(
        "RC343 FINDING: SIDEBAR ROLE CONTRACT IS INCOMPLETE OR CONTRIBUTION-DRAW ROUTING IS NOT FULLY DETECTABLE."
    );

    console.log(
        "RC343 STATUS: CONTINUE UPSTREAM AUTHORIZATION TRACE."
    );
}

console.log("");
console.log("===============================================");
console.log("RC343 AUDIT COMPLETE");
console.log("===============================================");
console.log("RC343: NO FILES MODIFIED");
