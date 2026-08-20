/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC194 — MEMBER PERSISTENCE IDENTITY REPAIR
 *
 * Purpose:
 * Repair RC193 after its first patch succeeded while
 * the second exact-match patch failed.
 *
 * Changes:
 * 1. Add setDoc to Firebase Firestore imports.
 * 2. Make Firebase create() use memberId as the
 *    Firestore document ID when memberId exists.
 * 3. Preserve generic addDoc behavior for all other
 *    records.
 *
 * Production target:
 *   js/adapters/firebaseAdapter.js
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [

    {
        path: "js/adapters/firebaseAdapter.js",
        mode: "regex",

        search: /import\s*\{\s*collection,\s*addDoc,\s*(?:setDoc,\s*)?getDoc,\s*getDocs,\s*updateDoc,\s*deleteDoc,\s*doc\s*\}\s*from\s*"https:\/\/www\.gstatic\.com\/firebase\/12\.0\.0\/firebase-firestore\.js";/,

        replace: `import {
    collection,
    addDoc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";`
    },

    {
        path: "js/adapters/firebaseAdapter.js",
        mode: "regex",

        search: /    async create\(data\) \{\s*const document = await addDoc\(\s*collection\(db, this\.collectionName\),\s*data\s*\);\s*return document\.id;\s*    \}/,

        replace: `    async create(data) {
        if (data?.memberId) {
            await setDoc(
                doc(
                    db,
                    this.collectionName,
                    data.memberId
                ),
                data
            );

            return data.memberId;
        }

        const document = await addDoc(
            collection(db, this.collectionName),
            data
        );

        return document.id;
    }`
    }

];

console.log("==================================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC194 — MEMBER PERSISTENCE IDENTITY REPAIR");
console.log("==================================================");
console.log("PATCH COUNT:", patches.length);
console.log("");

const result = await transaction(patches);

console.log("TRANSACTION RESULT:");
console.log(JSON.stringify(result, null, 2));

if (!result.success) {
    process.exitCode = 1;
}

console.log("==================================================");
console.log(
    result.success
        ? "RC194 MEMBER PERSISTENCE IDENTITY REPAIR: PASS"
        : "RC194 MEMBER PERSISTENCE IDENTITY REPAIR: FAIL"
);
console.log("==================================================");
