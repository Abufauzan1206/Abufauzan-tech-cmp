/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Service Layer
 * File: counterService.js
 * Version: 2.0.0
 *
 * Runtime-Aware Counter Service
 * =====================================================
 */

/*
 * Node.js tests must not load Firebase browser modules.
 *
 * Browser  -> Firebase Firestore counters
 * Node.js  -> In-memory counters
 */

const isNodeRuntime =
    typeof process !== "undefined" &&
    process.versions?.node;

let firebaseDoc = null;
let firebaseGetDoc = null;
let firebaseSetDoc = null;
let firebaseRunTransaction = null;
let db = null;

if (!isNodeRuntime) {

    const firestoreModule =
        await import(
            "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js"
        );

    firebaseDoc =
        firestoreModule.doc;

    firebaseGetDoc =
        firestoreModule.getDoc;

    firebaseSetDoc =
        firestoreModule.setDoc;

    firebaseRunTransaction =
        firestoreModule.runTransaction;

    const firebaseConfig =
        await import("../firebase-config.js");

    db = firebaseConfig.db;
}


/*
 * Node.js test counters.
 */
const memoryCounters = new Map();


export async function getNextSequence(counterName) {

    /*
     * =================================================
     * NODE.JS / TEST RUNTIME
     * =================================================
     */

    if (isNodeRuntime) {

        const currentSequence =
            memoryCounters.get(counterName) ?? 0;

        const nextSequence =
            currentSequence + 1;

        memoryCounters.set(
            counterName,
            nextSequence
        );

        return nextSequence;
    }


    /*
     * =================================================
     * BROWSER / FIREBASE RUNTIME
     * =================================================
     */

    const counterRef =
        firebaseDoc(
            db,
            "counters",
            counterName
        );


    const nextSequence =
        await firebaseRunTransaction(
            db,
            async (transaction) => {

                const counterDoc =
                    await transaction.get(
                        counterRef
                    );


                if (!counterDoc.exists()) {

                    transaction.set(
                        counterRef,
                        {
                            sequence: 1
                        }
                    );

                    return 1;
                }


                const currentSequence =
                    counterDoc.data().sequence || 0;


                const newSequence =
                    currentSequence + 1;


                transaction.update(
                    counterRef,
                    {
                        sequence:
                            newSequence
                    }
                );


                return newSequence;
            }
        );


    return nextSequence;
}
