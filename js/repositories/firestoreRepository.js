/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Repository Module: RP-009
 *
 * File: firestoreRepository.js
 * Version: 1.0.0
 * =====================================================
 */

import {

    collection,
    addDoc,
    getDocs

} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

import { db } from "../firebase/config.js";

export class CMPFirestoreRepository {

    constructor(collectionName) {

        this.collectionName = collectionName;

    }

    /**
     * Save a document
     */
    async save(data) {

        return await addDoc(

            collection(
                db,
                this.collectionName
            ),

            data

        );

    }

    /**
     * Get all documents
     */
    async getAll() {

        const snapshot = await getDocs(

            collection(
                db,
                this.collectionName
            )

        );

        return snapshot.docs.map(

            doc => ({

                id: doc.id,

                ...doc.data()

            })

        );

    }

}