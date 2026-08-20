/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC193 — MEMBER PERSISTENCE IDENTITY PATCH
 *
 * Purpose:
 * Align Member application IDs with Firestore document
 * identity so getMemberById(memberId) retrieves the
 * persisted member.
 *
 * Generic adapter behavior remains unchanged for records
 * without a canonical memberId.
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "js/adapters/firebaseAdapter.js",
        mode: "exact",

        search: `    collection,
    addDoc,
    getDoc,`,

        replace: `    collection,
    addDoc,
    setDoc,
    getDoc,`
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
console.log("RC193 — MEMBER PERSISTENCE IDENTITY PATCH");
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
        ? "RC193 MEMBER PERSISTENCE IDENTITY: PASS"
        : "RC193 MEMBER PERSISTENCE IDENTITY: FAIL"
);
console.log("==================================================");
