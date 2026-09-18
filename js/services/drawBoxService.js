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

import {
    doc,
    getDoc,
    updateDoc
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
    getFunctions,
    httpsCallable
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-functions.js";

const functions = getFunctions();

export async function createDrawBox(boxData) {
    const callable =
        httpsCallable(
            functions,
            "createDrawBox"
        );

    const result =
        await callable({
            groupId:
                boxData?.groupId,
            memberId:
                boxData?.memberId
        });

    return result.data?.boxId;
}



export async function getGroupBoxes(groupId) {

    const q = query(

        collection(
            db,
            "drawBoxes"
        ),

        where(
            "groupId",
            "==",
            groupId
        )

    );

    console.log("Loading boxes for group:", groupId);

const snapshot = await getDocs(q);

console.log("Documents found:", snapshot.size);

    const boxes = [];

    snapshot.forEach(doc => {

        boxes.push({

            id: doc.id,

            ...doc.data()

        });

    });

    return boxes;

}

export async function updateBoxAssignment(
    boxId,
    month,
    year
) {
    const callable =
        httpsCallable(
            functions,
            "updateDrawBoxAssignment"
        );

    await callable({
        boxId,
        month,
        year
    });
}

export async function executeDraw(
    groupId,
    reservationId,
    selectedBoxId
) {
    const callable =
        httpsCallable(
            functions,
            "executeDraw"
        );

    const result =
        await callable({
            groupId,
            reservationId,
            selectedBoxId
        });

    return result.data;
}

export async function reserveMonth(
  groupId,
  boxId,
  participantId
) {
  const callable = httpsCallable(
    functions,
    "reserveDrawMonth"
  );

  const result = await callable({
    groupId,
    boxId,
    participantId
  });

  return result.data;
}

export async function getDrawBox(

    boxId

) {

    const snapshot =
    await getDoc(

        doc(
            db,
            "drawBoxes",
            boxId
        )

    );

    if (

        !snapshot.exists()

    ) {

        return null;

    }

    return {

        id: snapshot.id,

        ...snapshot.data()

    };

}

export async function releaseMonth(
  reservationId
) {
  const callable = httpsCallable(
    functions,
    "releaseDrawMonth"
  );

  const result = await callable({
    reservationId
  });

  return result.data;
}

export async function getBoxByMonth(

    groupId,

    month,

    year

) {

    const boxes =
    await getGroupBoxes(
        groupId
    );

    return boxes.find(

        box =>

            box.month === month &&

            box.year === year

    ) || null;

}

