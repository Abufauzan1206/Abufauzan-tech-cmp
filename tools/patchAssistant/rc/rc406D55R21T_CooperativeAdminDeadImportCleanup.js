import { patch } from "../patchEngine.js";

const path = "js/cooperative-admin.js";

const search = `import { auth, db } from "./firebase-config.js";
import { enforceDashboardAccess } from "./controllers/accessController.js";
import { buildSidebar } from "./navigation/sidebar.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";`;

const replace = `import { auth } from "./firebase-config.js";
import { enforceDashboardAccess } from "./controllers/accessController.js";
import { buildSidebar } from "./navigation/sidebar.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";`;

if (!search.includes('import { auth, db }')) {
    throw new Error(
        "RC406-D55R21-T authoritative dead-import block not found; refusing non-deterministic patch."
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
console.log("RC406-D55R21-T — COOPERATIVE ADMIN DEAD-IMPORT CLEANUP");
console.log("===============================================");
console.log(result);
console.log("===============================================");
console.log("RC406-D55R21-T REPAIR COMPLETE");
