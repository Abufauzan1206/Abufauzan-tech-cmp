import fs from "fs";

const file = "js/navigation/sidebar.js";
const original = fs.readFileSync(file, "utf8");

const oldText = `window.location.href = "login.html";`;

const newText = `window.location.href = new URL("../../login.html", import.meta.url).href;`;

const count = (original.match(
    /window\.location\.href = "login\.html";/g
) || []).length;

if (count === 0) {
    throw new Error(
        "RC297D-E27: Expected sidebar login redirect contract was not found."
    );
}

const patched = original.replaceAll(oldText, newText);

fs.writeFileSync(file, patched);

console.log("================================================");
console.log("RC297D-E27 — PATCH APPLIED");
console.log("Sidebar login redirect made module-relative.");
console.log(`Repaired redirect occurrences: ${count}`);
console.log("================================================");
