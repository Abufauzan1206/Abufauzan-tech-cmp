import { db, auth } from "../firebase-config.js";

import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    getDoc,
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



export async function createDrawGroup(
    groupData
) {

    const profile =
        await getCurrentUserProfile();

    if (
        profile.role !== "super_admin" &&
        profile.role !== "cooperative_admin"
    ) {
        throw new Error(
            "Only authorized administrators can create draw groups."
        );
    }

    if (
        profile.role === "cooperative_admin" &&
        !profile.cooperativeId
    ) {
        throw new Error(
            "Cooperative administrator has no cooperative ownership."
        );
    }

    groupData.status =
        "Draft";

    groupData.cooperativeId =
        profile.role === "cooperative_admin"
            ? profile.cooperativeId
            : groupData.cooperativeId ?? null;

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
    const profile =
        await getCurrentUserProfile();

    const snapshot =
        await getDocs(
            collection(
                db,
                "drawGroups"
            )
        );

    const groups = [];

    snapshot.forEach(doc => {
        const data = doc.data();

        if (
            profile.role === "cooperative_admin" &&
            data.cooperativeId !== profile.cooperativeId
        ) {
            return;
        }

        groups.push({
            id: doc.id,
            ...data
        });
    });

    return groups;
}

export async function getDrawGroupById(
    groupId
) {
    const profile =
        await getCurrentUserProfile();

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
            const data = doc.data();

            if (
                profile.role === "cooperative_admin" &&
                data.cooperativeId !== profile.cooperativeId
            ) {
                return;
            }

            group = {
                id: doc.id,
                ...data
            };
        }
    });

    if (!group) {
        throw new Error("Draw group not found");
    }

    return group;
}

export async function updateGroupStatus(

    groupId,

    status

) {
    if (typeof status !== "string") {
        throw new Error(
            "Invalid draw group status."
        );
    }

    if (status.trim().length === 0) {
        throw new Error(
            "Invalid draw group status."
        );
    }

    const validDrawGroupStatuses = [
        "Draft"
    ];

    if (
        !validDrawGroupStatuses.includes(
            status.trim()
        )
    ) {
        throw new Error(
            "Invalid draw group status."
        );
    }

    status = status.trim();



    const profile =
        await getCurrentUserProfile();

    if (
        profile.role !== "super_admin" &&
        profile.role !== "cooperative_admin"
    ) {
        throw new Error(
            "Unauthorized: only authorized administrators can update draw group status."
        );
    }

    const groupRef = doc(
        db,
        "drawGroups",
        groupId
    );

    const groupSnap =
        await getDoc(groupRef);

    if (!groupSnap.exists()) {
        throw new Error(
            "Draw group not found."
        );
    }

    const groupData =
        groupSnap.data();

    if (
        profile.role === "cooperative_admin" &&
        groupData.cooperativeId !== profile.cooperativeId
    ) {
        throw new Error(
            "Cooperative administrator cannot update a draw group owned by another cooperative."
        );
    }

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