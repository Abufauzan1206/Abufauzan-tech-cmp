import { db } from "../firebase-config.js";

import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    serverTimestamp,
    doc,
    updateDoc
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

export async function applyWelfare(
    welfareData
) {

    welfareData.status =
        "Pending";

    welfareData.createdAt =
    serverTimestamp();

    const docRef = await addDoc(
        collection(db, "welfare"),
        welfareData
    );

    return docRef.id;

}

export async function getMemberWelfare(
    memberId
) {

    const q = query(
        collection(db, "welfare"),
        where("memberId", "==", memberId)
    );

    const snapshot =
        await getDocs(q);

    const requests = [];

    snapshot.forEach(doc => {

        requests.push({

            id: doc.id,

            ...doc.data()

        });

    });

    return requests;

}

export async function getApprovedWelfare(
    memberId
) {

    const welfare =
        await getMemberWelfare(
            memberId
        );

    return welfare.filter(

        request =>

            request.status ===
            "Approved"

    );

}

export async function getWelfareSummary(
    memberId
) {

    const welfare =
        await getMemberWelfare(
            memberId
        );

    const totalAmount =
        welfare.reduce(

            (sum, request) =>

                sum +
                Number(
                    request.amount || 0
                ),

            0

        );

    return {

        totalRequests:
            welfare.length,

        totalAmount

    };

}

export async function getWelfareRequests() {

    const snapshot =
        await getDocs(
            collection(db, "welfare")
        );

    const requests = [];

    snapshot.forEach(doc => {

        requests.push({

            id: doc.id,

            ...doc.data()

        });

    });

    return requests;

}

export async function updateWelfareStatus(
    welfareId,
    status
) {

    await updateDoc(

        doc(
            db,
            "welfare",
            welfareId
        ),

        {
            status
        }

    );

}