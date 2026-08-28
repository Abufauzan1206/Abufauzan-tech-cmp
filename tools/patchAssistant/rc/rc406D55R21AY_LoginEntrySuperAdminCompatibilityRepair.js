import { patch } from "../patchEngine.js";
import { readFile } from "node:fs/promises";

const path = "login.html";

const search = `<select
id="loginAsRole"
required
style="width:100%;padding:12px;border:1px solid #CBD5E1;border-radius:8px;">`;

const replace = `<select
id="loginAsRole"
style="width:100%;padding:12px;border:1px solid #CBD5E1;border-radius:8px;">`;

const source = await readFile(path, "utf8");

if (!source.includes(search)) {
    throw new Error(
        "RC406-D55R21-AY target contract invalid; refusing non-deterministic patch."
    );
}

if ((source.match(/id="loginAsRole"/g) || []).length !== 1) {
    throw new Error(
        "RC406-D55R21-AY expected exactly one loginAsRole control."
    );
}

const result = await patch({
    path,
    mode: "exact",
    search,
    replace
});

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D55R21-AY — LOGIN ENTRY SUPER ADMIN COMPATIBILITY REPAIR");
console.log("===============================================");
console.log("PATCH:", result);
console.log("===============================================");
console.log("RC406-D55R21-AY REPAIR COMPLETE");
