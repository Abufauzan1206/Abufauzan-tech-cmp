/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Database Adapter Layer
 *
 * File: firebaseAdapter.js
 * Module: DA-002
 * Version: 1.4.0
 *
 * Firebase Database Adapter
 * =====================================================
 */

import { CMPDatabaseAdapter } from "./databaseAdapter.js";
import { db } from "../firebase-config.js";

import {
    collection,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

export class CMPFirebaseAdapter extends CMPDatabaseAdapter {

    constructor(collectionName) {

        super();

        this.collectionName = collectionName;

    }

    async create(data) {

        const document = await addDoc(
            collection(db, this.collectionName),
            data
        );

        return document.id;

    }

    async findById(id) {

        const snapshot = await getDoc(
            doc(db, this.collectionName, id)
        );

        if (!snapshot.exists()) {

            return null;

        }

        return {

            id: snapshot.id,

            ...snapshot.data()

        };

    }

    async findAll() {

        const snapshot = await getDocs(
            collection(db, this.collectionName)
        );

        const records = [];

        snapshot.forEach((document) => {

            records.push({

                id: document.id,

                ...document.data()

            });

        });

        return records;

    }

}
