import { db } from "../firebase-config.js";

import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    serverTimestamp
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

export async function createDrawGroup(
    groupData
) {

    groupData.status =
"Draft";

    groupData.createdAt =
        serverTimestamp();

    const docRef =
        await addDoc(

            collection(
                db,
                "drawGroups"
            ),

            groupData

        );

    return docRef.id;

}

export async function getDrawGroups() {

    const snapshot =
        await getDocs(
            collection(
                db,
                "drawGroups"
            )
        );

    const groups = [];

    snapshot.forEach(doc => {

        groups.push({

            id: doc.id,

            ...doc.data()

        });

    });

    return groups;

}

export async function getDrawGroupById(
    groupId
) {

    const snapshot =
        await getDocs(
            collection(
                db,
                "drawGroups"
            )
        );

    let group = null;

    snapshot.forEach(doc => {

        if (
            doc.id === groupId
        ) {

            group = {

                id: doc.id,

                ...doc.data()

            };

        }

    });

    return group;

}

export async function updateGroupStatus(

    groupId,

    status

) {

    await updateDoc(

        doc(

            db,

            "drawGroups",

            groupId

        ),

        {

            status

        }

    );

}