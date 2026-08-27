import fs from "fs";
import path from "path";

const servicesDir = "js/services";

console.log("===============================================");
console.log("RC329 MEMBER SERVICE TRUST-BOUNDARY INVENTORY");
console.log("===============================================");

const files = fs.readdirSync(servicesDir)
    .filter(file => file.endsWith(".js"))
    .sort();

for (const file of files) {
    const filePath = path.join(servicesDir, file);
    const content = fs.readFileSync(filePath, "utf8");

    const exportedFunctions = [
        ...content.matchAll(
            /export\s+(?:async\s+)?function\s+([A-Za-z0-9_]+)/g
        )
    ].map(match => match[1]);

    const writes = [
        ...content.matchAll(
            /\b(addDoc|setDoc|updateDoc)\s*\(/g
        )
    ].map(match => match[1]);

    const authUsage =
        /auth\.currentUser/.test(content);

    const ownershipFields =
        /memberId|cooperativeId/.test(content);

    console.log("");
    console.log(`FILE: ${file}`);
    console.log(
        `FUNCTIONS: ${
            exportedFunctions.length
                ? exportedFunctions.join(", ")
                : "none"
        }`
    );
    console.log(
        `WRITES: ${
            writes.length
                ? writes.join(", ")
                : "none"
        }`
    );
    console.log(
        `AUTH CURRENT USER: ${
            authUsage ? "YES" : "NO"
        }`
    );
    console.log(
        `OWNERSHIP FIELDS: ${
            ownershipFields ? "YES" : "NO"
        }`
    );
}

console.log("");
console.log("===============================================");
console.log("RC329 INVENTORY COMPLETE");
console.log("===============================================");
console.log(
    "RC329: NO FILES MODIFIED"
);
