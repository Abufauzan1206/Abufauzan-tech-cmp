import {
  getFunctions,
  httpsCallable
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-functions.js";

const functions = getFunctions();

export async function createReservation(
  reservation
) {
  const callable = httpsCallable(
    functions,
    "reserveDrawMonth"
  );

  const result = await callable({
    groupId: reservation.groupId,
    boxId: reservation.boxId,
    participantId: reservation.participantId
  });

  return result.data.reservationId;
}

export async function getGroupReservations(
  groupId
) {
  const callable = httpsCallable(
    functions,
    "getDrawGroupReservations"
  );

  const result = await callable({
    groupId
  });

  return result.data.reservations || [];
}

export async function deleteReservation(
  reservationId
) {
  const callable = httpsCallable(
    functions,
    "releaseDrawMonth"
  );

  await callable({
    reservationId
  });
}

export async function updateReservation(
  reservationId,
  data
) {
  throw new Error(
    "Reservation updates are not supported by D129."
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
