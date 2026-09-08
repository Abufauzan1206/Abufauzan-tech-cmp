/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Repository Module: RP-003
 *
 * File: contributionRepository.js
 * Version: 2.0.0
 *
 * Adapter Based Contribution Repository
 * =====================================================
 */

import { CMPBaseRepository } from "./baseRepository.js";
import { CMPAdapterFactory } from "../adapters/adapterFactory.js";
import { db } from "../firebase-config.js";
import {
    addDoc,
    collection
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

export class CMPContributionRepository
    extends CMPBaseRepository {


    constructor() {
        super(
            CMPAdapterFactory.firebase("contributions")
        );

    }


    async create(data) {
        if (!data || typeof data !== "object") {
            throw new TypeError("Contribution data must be an object.");
        }

        const document = await addDoc(
            collection(db, "contributions"),
            data
        );

        return document.id;
    }



}
