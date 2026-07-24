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

export async function createDrawBox(boxData) {

    const existingBoxes =
    await getGroupBoxes(
        boxData.groupId
    );

    const boxNumber =
    existingBoxes.length + 1;

    boxData.boxNumber =
    boxNumber;

    boxData.displayNumber =
    String(boxNumber)
    .padStart(2, "0");
    
    boxData.month = null;

boxData.year = null;

boxData.participantId = null;

boxData.participantName = null;

boxData.slotNumber = null;

boxData.revealed = false;

boxData.picked = false;

boxData.locked = false;

boxData.pickedBy = null;

boxData.pickedAt = null;

boxData.lockedBy = null;

boxData.lockedAt = null;

    boxData.createdAt =
    serverTimestamp();

    boxData.status =
    "Available";

    const docRef =
    await addDoc(

        collection(
            db,
            "drawBoxes"
        ),

        boxData

    );

    return docRef.id;

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

    await updateDoc(

        doc(
            db,
            "drawBoxes",
            boxId
        ),

{

    month,

    year,

    status: "Ready",

    picked: false,

    pickedBy: null,

    pickedAt: null,

    locked: false,

    lockedBy: null,

    lockedAt: null,

    reserved: false,

    reservedBy: null,

    reservedAt: null

}

    );

}

export async function revealDrawBox(

    boxId,

    participantId

) {

    await updateDoc(

        doc(
            db,
            "drawBoxes",
            boxId
        ),

{

    status: "Picked",

    picked: true,

    pickedBy: participantId,

    pickedAt: serverTimestamp(),

    locked: true,

    lockedBy: participantId,

    lockedAt: serverTimestamp()

}

    );

}

export async function reserveMonth(

    boxId,

    adminId

) {

    await updateDoc(

        doc(
            db,
            "drawBoxes",
            boxId
        ),

{

    reserved: true,

    reservedBy: adminId,

    reservedAt: serverTimestamp(),

    status: "Reserved"

}

    );

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

    boxId

) {

    await updateDoc(

        doc(
            db,
            "drawBoxes",
            boxId
        ),

        {

            reserved: false,

            reservedBy: null,

            reservedAt: null,

            status: "Ready"

        }

    );

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

export async function swapMonths(

    firstBoxId,

    secondBoxId

) {

    const firstBox =
    await getDrawBox(
        firstBoxId
    );

    const secondBox =
    await getDrawBox(
        secondBoxId
    );
    
    const firstMonth =
firstBox.month;

const firstYear =
firstBox.year;

const secondMonth =
secondBox.month;

const secondYear =
secondBox.year;

await updateDoc(

    doc(
        db,
        "drawBoxes",
        firstBoxId
    ),

    {

        month: secondMonth,

        year: secondYear

    }

);

await updateDoc(

    doc(
        db,
        "drawBoxes",
        secondBoxId
    ),

    {

        month: firstMonth,

        year: firstYear

    }

);

}

