import { db } from "../firebase-config.js";

import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    serverTimestamp,
    deleteDoc,
    updateDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

export async function createReservation(

    reservation

) {

    reservation.createdAt =
    serverTimestamp();

    const docRef =
    await addDoc(

        collection(
            db,
            "drawReservations"
        ),

        reservation

    );

    return docRef.id;

}

export async function getGroupReservations(

    groupId

) {

    const q = query(

        collection(
            db,
            "drawReservations"
        ),

        where(
            "groupId",
            "==",
            groupId
        )

    );

    const snapshot =
    await getDocs(q);

    const reservations = [];

    snapshot.forEach(doc => {

        reservations.push({

            id: doc.id,

            ...doc.data()

        });

    });

    return reservations;

}

export async function deleteReservation(

    reservationId

) {

    await deleteDoc(

        doc(
            db,
            "drawReservations",
            reservationId
        )

    );

}

export async function updateReservation(

    reservationId,

    data

) {

    await updateDoc(

        doc(
            db,
            "drawReservations",
            reservationId
        ),

        data

    );

}

export async function getReservationByParticipant(

    groupId,

    participantId

)

{

    const reservations =
    await getGroupReservations(
        groupId
    );

    return reservations.find(

        reservation =>

            reservation.participantId ===
participantId

    ) || null;

}