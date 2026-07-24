import { db } from "../firebase-config.js";

import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

export async function registerMember(memberData) {

  // Count existing members
  const snapshot = await getDocs(collection(db, "members"));

  const nextNumber = snapshot.size + 1;

  const year = new Date().getFullYear();

  const memberNumber =
    `ABT-M-${year}-${String(nextNumber).padStart(6, "0")}`;

  memberData.memberNumber = memberNumber;

memberData.createdAt = serverTimestamp();

memberData.status = "active";

  const docRef = await addDoc(
    collection(db, "members"),
    memberData
  );

  return {
    documentId: docRef.id,
    memberNumber: memberNumber
  };

}

export async function getMembers() {

  const snapshot = await getDocs(collection(db, "members"));

  const members = [];

  snapshot.forEach((doc) => {

    members.push({
      id: doc.id,
      ...doc.data()
    });

  });

  return members;

}

export async function getMemberById(memberId) {

  const memberRef = doc(db, "members", memberId);

  const memberSnap = await getDoc(memberRef);

  if (!memberSnap.exists()) {

    return null;

  }

  return {

    id: memberSnap.id,

    ...memberSnap.data()

  };

}