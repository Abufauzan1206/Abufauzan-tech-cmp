import fs from "fs";

const file = "js/navigation/sidebar.js";

console.log("===============================================");
console.log("RC344 COOPERATIVE-ADMIN DRAW OWNERSHIP AUDIT");
console.log("===============================================");

if (!fs.existsSync(file)) {
    console.log(`FILE NOT FOUND: ${file}`);
    process.exit(1);
}

const content = fs.readFileSync(file, "utf8");
const lines = content.split("\n");

const cooperativeStart = lines.findIndex(line =>
    /rolesMatch\s*\(\s*role\s*,\s*["']cooperative_admin["']\s*\)/.test(line)
);

const memberStart = lines.findIndex(line =>
    /rolesMatch\s*\(\s*role\s*,\s*["']member["']\s*\)/.test(line)
);

const superStart = lines.findIndex(line =>
    /rolesMatch\s*\(\s*role\s*,\s*["']super_admin["']\s*\)/.test(line)
);

console.log("");
console.log("----- ROLE BRANCH LOCATIONS -----");

console.log(
    `super_admin branch: ${
        superStart >= 0 ? `line ${superStart + 1}` : "NOT FOUND"
    }`
);

console.log(
    `cooperative_admin branch: ${
        cooperativeStart >= 0
            ? `line ${cooperativeStart + 1}`
            : "NOT FOUND"
    }`
);

console.log(
    `member branch: ${
        memberStart >= 0 ? `line ${memberStart + 1}` : "NOT FOUND"
    }`
);

function branchEnd(start, nextStarts) {
    const candidates = nextStarts
        .filter(value => value > start)
        .sort((a, b) => a - b);

    return candidates.length
        ? candidates[0]
        : lines.length;
}

console.log("");
console.log("----- SUPER ADMIN DRAW OWNERSHIP -----");

if (superStart >= 0) {
    const end = branchEnd(
        superStart,
        [cooperativeStart, memberStart]
    );

    const branch = lines.slice(superStart, end);
    const hasDraw = branch.some(line =>
        /contribution-draw|Contribution Draw/.test(line)
    );

    console.log(
        `SUPER ADMIN CONTRIBUTION-DRAW: ${
            hasDraw ? "PRESENT" : "ABSENT"
        }`
    );

    if (hasDraw) {
        branch.forEach((line, index) => {
            if (/contribution-draw|Contribution Draw/.test(line)) {
                console.log(
                    `${superStart + index + 1}: ${line.trim()}`
                );
            }
        });
    }
}

console.log("");
console.log("----- COOPERATIVE ADMIN DRAW OWNERSHIP -----");

if (cooperativeStart >= 0) {
    const end = branchEnd(
        cooperativeStart,
        [memberStart, superStart]
    );

    const branch = lines.slice(cooperativeStart, end);
    const hasDraw = branch.some(line =>
        /contribution-draw|Contribution Draw/.test(line)
    );

    console.log(
        `COOPERATIVE ADMIN CONTRIBUTION-DRAW: ${
            hasDraw ? "PRESENT" : "ABSENT"
        }`
    );

    if (hasDraw) {
        branch.forEach((line, index) => {
            if (/contribution-draw|Contribution Draw/.test(line)) {
                console.log(
                    `${cooperativeStart + index + 1}: ${line.trim()}`
                );
            }
        });
    }
}

console.log("");
console.log("----- MEMBER DRAW OWNERSHIP -----");

if (memberStart >= 0) {
    const end = branchEnd(
        memberStart,
        [superStart, cooperativeStart]
    );

    const branch = lines.slice(memberStart, end);
    const hasDraw = branch.some(line =>
        /contribution-draw|Contribution Draw/.test(line)
    );

    console.log(
        `MEMBER CONTRIBUTION-DRAW: ${
            hasDraw ? "PRESENT" : "ABSENT"
        }`
    );

    if (hasDraw) {
        branch.forEach((line, index) => {
            if (/contribution-draw|Contribution Draw/.test(line)) {
                console.log(
                    `${memberStart + index + 1}: ${line.trim()}`
                );
            }
        });
    }
}

console.log("");
console.log("----- RC344 DECISION -----");

const superHasDraw =
    superStart >= 0 &&
    lines
        .slice(
            superStart,
            branchEnd(superStart, [
                cooperativeStart,
                memberStart
            ])
        )
        .some(line =>
            /contribution-draw|Contribution Draw/.test(line)
        );

const cooperativeHasDraw =
    cooperativeStart >= 0 &&
    lines
        .slice(
            cooperativeStart,
            branchEnd(cooperativeStart, [
                memberStart,
                superStart
            ])
        )
        .some(line =>
            /contribution-draw|Contribution Draw/.test(line)
        );

const memberHasDraw =
    memberStart >= 0 &&
    lines
        .slice(
            memberStart,
            branchEnd(memberStart, [
                superStart,
                cooperativeStart
            ])
        )
        .some(line =>
            /contribution-draw|Contribution Draw/.test(line)
        );

if (superHasDraw && cooperativeHasDraw && !memberHasDraw) {
    console.log(
        "RC344 FINDING: CONTRIBUTION-DRAW IS EXPOSED TO BOTH ADMIN ROLES AND NOT TO MEMBERS."
    );

    console.log(
        "RC344 STATUS: ADMIN ROLE CONTRACT IS SUPER_ADMIN + COOPERATIVE_ADMIN; TRACE THAT CONTRACT DOWNSTREAM."
    );
} else if (superHasDraw && !cooperativeHasDraw && !memberHasDraw) {
    console.log(
        "RC344 FINDING: CONTRIBUTION-DRAW IS EXPOSED TO SUPER_ADMIN ONLY."
    );

    console.log(
        "RC344 STATUS: SUPER_ADMIN IS THE CURRENT UPSTREAM TRUST BOUNDARY."
    );
} else if (memberHasDraw) {
    console.log(
        "RC344 FINDING: CONTRIBUTION-DRAW IS ALSO EXPOSED TO THE MEMBER ROLE."
    );

    console.log(
        "RC344 STATUS: ROLE CONTRACT REQUIRES REVIEW BEFORE ANY SERVICE AUTHORIZATION PATCH."
    );
} else {
    console.log(
        "RC344 FINDING: CONTRIBUTION-DRAW ROLE OWNERSHIP IS NOT FULLY ESTABLISHED."
    );

    console.log(
        "RC344 STATUS: CONTINUE UPSTREAM AUTHORIZATION TRACE."
    );
}

console.log("");
console.log("===============================================");
console.log("RC344 AUDIT COMPLETE");
console.log("===============================================");
console.log("RC344: NO FILES MODIFIED");
