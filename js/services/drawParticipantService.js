import { db } from "../firebase-config.js";

import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    serverTimestamp
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

export async function addParticipantToGroup(
    participantData
) {

    participantData.joinedAt =
    serverTimestamp();

    participantData.status =
    "Active";

    const docRef =
    await addDoc(

        collection(
            db,
            "drawParticipants"
        ),

        participantData

    );

    return docRef.id;

}

export async function participantExists(
    groupId,
    memberId
) {

    const q = query(

        collection(
            db,
            "drawParticipants"
        ),

        where(
            "groupId",
            "==",
            groupId
        ),

        where(
            "memberId",
            "==",
            memberId
        )

    );

    const snapshot =
    await getDocs(q);

    return !snapshot.empty;

}

export async function getGroupParticipants(
    groupId
) {

    const q = query(

        collection(
            db,
            "drawParticipants"
        ),

        where(
            "groupId",
            "==",
            groupId
        )

    );

    const snapshot =
    await getDocs(q);

    const participants = [];

    snapshot.forEach(doc => {

        participants.push({

            id: doc.id,

            ...doc.data()

        });

    });

    return participants;

}

export async function getUsedSlots(
    groupId
) {

    const participants =
    await getGroupParticipants(
        groupId
    );

    return participants.reduce(

        (sum, participant) =>

            sum +
            Number(
                participant.slotCount || 1
            ),

        0

    );

}