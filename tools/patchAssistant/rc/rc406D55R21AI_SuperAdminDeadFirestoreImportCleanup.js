import { patch } from "../patchEngine.js";

const path = "js/super-admin.js";

const search = `import {
    collection,
    doc,
    getDoc,
    getDocs,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";`;

const replace = `import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";`;

if (!search.includes("doc") ||
    !search.includes("getDoc") ||
    !search.includes("updateDoc")) {
    throw new Error(
        "RC406-D55R21-AI target contract invalid; refusing non-deterministic patch."
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
console.log("RC406-D55R21-AI — SUPER ADMIN DEAD FIRESTORE IMPORT CLEANUP");
console.log("===============================================");
console.log(result);
console.log("===============================================");
console.log("RC406-D55R21-AI REPAIR COMPLETE");
