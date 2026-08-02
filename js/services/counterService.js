/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Service Layer
 *
 * File: counterService.js
 * Version: 1.0.0
 *
 * Firestore Counter Service
 * =====================================================
 */

import {
    doc,
    getDoc,
    setDoc,
    runTransaction
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import { db } from "../firebase-config.js";


export async function getNextSequence(counterName) {

    const counterRef = doc(db, "counters", counterName);

    const nextSequence = await runTransaction(db, async (transaction) => {

        const counterDoc = await transaction.get(counterRef);

        if (!counterDoc.exists()) {

            transaction.set(counterRef, {
                sequence: 1
            });

            return 1;

        }

        const currentSequence = counterDoc.data().sequence || 0;

        const newSequence = currentSequence + 1;

        transaction.update(counterRef, {
            sequence: newSequence
        });

        return newSequence;

    });

    return nextSequence;

}
