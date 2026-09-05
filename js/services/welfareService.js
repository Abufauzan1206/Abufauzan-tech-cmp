import { db, auth } from "../firebase-config.js";
import { getAuthenticatedProfile } from "../controllers/accessController.js";

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
    const user = auth.currentUser;

    if (!user) {
        throw new Error(
            "Authenticated member required."
        );
    }

    const profileSnapshot = await getDocs(
        query(
            collection(db, "users"),
            where("__name__", "==", user.uid)
        )
    );

    if (profileSnapshot.empty) {
        throw new Error(
            "Authenticated member profile not found."
        );
    }

    const profile =
        profileSnapshot.docs[0].data();

    if (!profile.memberId) {
        throw new Error(
            "Authenticated member profile has no memberId."
        );
    }

    const ownedWelfareData = {
        ...welfareData,
        memberId: profile.memberId,
        cooperativeId:
            profile.cooperativeId ?? null,
        status: "Pending",
        createdAt: serverTimestamp()
    };

    const docRef = await addDoc(
        collection(db, "welfare"),
        ownedWelfareData
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

    const session = await getAuthenticatedProfile();

    if (!session) {
        throw new Error("Authenticated user required.");
    }

    const role = session.profile?.role;

    let snapshot;

    if (
        role === "cooperative_admin" ||
        role === "cooperativeAdmin"
    ) {
        const cooperativeId =
            session.profile?.cooperativeId;

        if (
            typeof cooperativeId !== "string" ||
            !cooperativeId.trim()
        ) {
            throw new Error(
                "Cooperative administrator profile has no cooperativeId."
            );
        }

        const q = query(
            collection(db, "welfare"),
            where(
                "cooperativeId",
                "==",
                cooperativeId.trim()
            )
        );

        snapshot = await getDocs(q);
    } else {
        snapshot = await getDocs(
            collection(db, "welfare")
        );
    }

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