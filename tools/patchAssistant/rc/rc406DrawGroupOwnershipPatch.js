import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "js/services/drawGroupService.js",
        search: `import { db } from "../firebase-config.js";`,
        replace: `import { db, auth } from "../firebase-config.js";`
    },

    {
        path: "js/services/drawGroupService.js",
        search: `    updateDoc,
    serverTimestamp
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";`,
        replace: `    updateDoc,
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
}`
    },

    {
        path: "js/services/drawGroupService.js",
        search: `export async function createDrawGroup(
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

}`,
        replace: `export async function createDrawGroup(
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
        serverTimestamp();`
    },

    {
        path: "js/services/drawGroupService.js",
        search: `export async function getDrawGroups() {

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

}`,
        replace: `export async function getDrawGroups() {
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
}`
    },

    {
        path: "js/services/drawGroupService.js",
        search: `export async function getDrawGroupById(
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

}`,
        replace: `export async function getDrawGroupById(
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

    return group;
}`
    }
];

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406 — DRAW GROUP COOPERATIVE OWNERSHIP PATCH");
console.log("===============================================");
console.log("PATCH COUNT:", patches.length);
console.log("");

try {
    const result = await transaction(patches);

    console.log("PATCH ENGINE RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;
    }

    console.log("");
    console.log(
        result.success
            ? "RC406 DRAW GROUP OWNERSHIP PATCH: PASS"
            : "RC406 DRAW GROUP OWNERSHIP PATCH: FAIL"
    );
} catch (error) {
    console.error("RC406 PATCH ERROR:", error.message);
    process.exitCode = 1;
}

console.log("===============================================");
