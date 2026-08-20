/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC195 — MEMBER PERSISTENCE IDENTITY EXACT PATCH
 *
 * Purpose:
 * Align canonical memberId with the Firestore document ID
 * while preserving generic addDoc() behavior for all other
 * repository records.
 *
 * Target:
 *   js/adapters/firebaseAdapter.js
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "js/adapters/firebaseAdapter.js",
        mode: "exact",

        search: `import {
    collection,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";`,

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
        mode: "exact",

        search: `    async create(data) {

        const document = await addDoc(
            collection(db, this.collectionName),
            data
        );

        return document.id;
    }`,

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
console.log("RC195 — MEMBER PERSISTENCE IDENTITY EXACT PATCH");
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
        ? "RC195 MEMBER PERSISTENCE IDENTITY EXACT PATCH: PASS"
        : "RC195 MEMBER PERSISTENCE IDENTITY EXACT PATCH: FAIL"
);
console.log("==================================================");
