import { db, auth } from "../firebase-config.js";

import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    getDoc,
    query,
    where,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

async function getCurrentUserProfile() {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("You must be signed in.");
    }

    const profileSnap = await getDoc(
        doc(db, "users", user.uid)
    );

    if (!profileSnap.exists()) {
        throw new Error("User profile not found.");
    }

    return profileSnap.data();
}



import {
    getFunctions,
    httpsCallable
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-functions.js";

const functions = getFunctions();

const createDrawGroupCallable =
    httpsCallable(
        functions,
        "createDrawGroup"
    );

export async function createDrawGroup(
    groupData
) {
    if (!groupData || typeof groupData !== "object") {
        throw new TypeError(
            "Draw group data is required."
        );
    }

    const result =
        await createDrawGroupCallable(
            groupData
        );

    if (!result?.data?.success) {
        throw new Error(
            result?.data?.message ||
            "Unable to create draw group."
        );
    }

    return result.data;
}

export async function getDrawGroups() {
    const profile =
        await getCurrentUserProfile();

    const groupsRef =
        collection(
            db,
            "drawGroups"
        );

    const snapshot =
        profile.role === "cooperative_admin"
            ? await getDocs(
                query(
                    groupsRef,
                    where(
                        "cooperativeId",
                        "==",
                        profile.cooperativeId
                    )
                )
            )
            : await getDocs(groupsRef);

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
        await getDoc(
            doc(
                db,
                "drawGroups",
                groupId
            )
        );

    if (!snapshot.exists()) {
        throw new Error("Draw group not found");
    }

    return {
        id: snapshot.id,
        ...snapshot.data()
    };
}

export async function updateGroupStatus(
  groupId,
  status
) {
  if (typeof status !== "string") {
    throw new Error("Invalid draw group status.");
  }

  if (status.trim().length === 0) {
    throw new Error("Invalid draw group status.");
  }

  const validDrawGroupStatuses = [
    "Draft"
  ];

  if (!validDrawGroupStatuses.includes(status.trim())) {
    throw new Error("Invalid draw group status.");
  }

  status = status.trim();

  const callable = httpsCallable(functions, "updateDrawGroupStatus");
  const result = await callable({
    groupId,
    status
  });

  return result.data;
}