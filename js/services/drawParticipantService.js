import { db } from "../firebase-config.js";
import {
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import {
  getFunctions,
  httpsCallable
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-functions.js";

const functions = getFunctions();

export async function addParticipantToGroup(
  participantData
) {
  const callable = httpsCallable(functions, "addParticipantToGroup");

  const result = await callable({
    groupId: participantData?.groupId,
    memberId: participantData?.memberId,
    slotCount: participantData?.slotCount
  });

  return result.data?.participantId;
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