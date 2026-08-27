import { transaction } from "../patchEngine.js";

const result = await transaction([
    {
        path: "tools/patchAssistant/rc/rc406DrawGroupOwnershipPatch.js",

        search: `        search: \`export async function createDrawGroup(
    groupData
) {
    groupData.status =
        "Draft";

    groupData.createdAt =
        serverTimestamp();\`,`,

        replace: `        search: \`export async function createDrawGroup(
    groupData
) {
    groupData.status =
        "Draft";
    groupData.createdAt =
        serverTimestamp();\`,`
    },

    {
        path: "tools/patchAssistant/rc/rc406DrawGroupOwnershipPatch.js",

        search: `        search: \`export async function getDrawGroups() {
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
}\`,`,

        replace: `        search: \`export async function getDrawGroups() {
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
}\`,`
    },

    {
        path: "tools/patchAssistant/rc/rc406DrawGroupOwnershipPatch.js",

        search: `        search: \`export async function getDrawGroupById(
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
}\`,`,

        replace: `        search: \`export async function getDrawGroupById(
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
}\`,`
    }
]);

console.log("===============================================");
console.log("RC406-D13 PATCH 3–5 CONTRACT REPAIR");
console.log("===============================================");
console.log(JSON.stringify(result, null, 2));

if (!result.success) {
    process.exitCode = 1;
}

console.log("===============================================");
