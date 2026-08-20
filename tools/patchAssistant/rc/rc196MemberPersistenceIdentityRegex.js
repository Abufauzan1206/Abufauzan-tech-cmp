/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC196 — MEMBER PERSISTENCE IDENTITY REGEX REPAIR
 *
 * Purpose:
 * Make Firebase member persistence use memberId as the
 * Firestore document ID while preserving generic create()
 * behavior for other entities.
 *
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "js/adapters/firebaseAdapter.js",
        mode: "regex",

        search: /import\s*\{\s*collection,\s*addDoc,\s*getDoc,/s,

        replace: `import {
    collection,
    addDoc,
    setDoc,
    getDoc,`
    },

    {
        path: "js/adapters/firebaseAdapter.js",
        mode: "regex",

        search: /    async create\(data\)\s*\{\s*const document\s*=\s*await addDoc\(\s*collection\(db,\s*this\.collectionName\),\s*data\s*\);\s*return document\.id;\s*\}/s,

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
console.log("RC196 — MEMBER PERSISTENCE IDENTITY REGEX REPAIR");
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
        ? "RC196 MEMBER PERSISTENCE IDENTITY REGEX: PASS"
        : "RC196 MEMBER PERSISTENCE IDENTITY REGEX: FAIL"
);
console.log("==================================================");
