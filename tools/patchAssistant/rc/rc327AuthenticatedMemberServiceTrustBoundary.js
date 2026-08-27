import { transaction } from "../patchEngine.js";

const patches = [

    {
        path: "js/services/loanService.js",
        mode: "regex",

        search:
`import\\s*\\{\\s*db\\s*\\}\\s*from\\s*"\\.\\./firebase-config\\.js";`,

        replace:
`import { db, auth } from "../firebase-config.js";`
    },

    {
        path: "js/services/loanService.js",
        mode: "regex",

        search:
`export async function applyLoan\\([\\s\\S]*?\\n\\}`,

        replace:
`export async function applyLoan(
    loanData
) {
    const user = auth.currentUser;

    if (!user) {
        throw new Error(
            "Authenticated member required."
        );
    }

    const profileSnapshot = await getDocs(
        query(
            collection(db, "users"),
            where("__name__", "==", user.uid)
        )
    );

    if (profileSnapshot.empty) {
        throw new Error(
            "Authenticated member profile not found."
        );
    }

    const profile =
        profileSnapshot.docs[0].data();

    if (!profile.memberId) {
        throw new Error(
            "Authenticated member profile has no memberId."
        );
    }

    const ownedLoanData = {
        ...loanData,
        memberId: profile.memberId,
        cooperativeId:
            profile.cooperativeId ?? null,
        status: "Pending",
        createdAt: serverTimestamp()
    };

    const docRef = await addDoc(
        collection(db, "loans"),
        ownedLoanData
    );

    return docRef.id;
}`
    },

    {
        path: "js/services/welfareService.js",
        mode: "regex",

        search:
`import\\s*\\{\\s*db\\s*\\}\\s*from\\s*"\\.\\./firebase-config\\.js";`,

        replace:
`import { db, auth } from "../firebase-config.js";`
    },

    {
        path: "js/services/welfareService.js",
        mode: "regex",

        search:
`export async function applyWelfare\\([\\s\\S]*?\\n\\}`,

        replace:
`export async function applyWelfare(
    welfareData
) {
    const user = auth.currentUser;

    if (!user) {
        throw new Error(
            "Authenticated member required."
        );
    }

    const profileSnapshot = await getDocs(
        query(
            collection(db, "users"),
            where("__name__", "==", user.uid)
        )
    );

    if (profileSnapshot.empty) {
        throw new Error(
            "Authenticated member profile not found."
        );
    }

    const profile =
        profileSnapshot.docs[0].data();

    if (!profile.memberId) {
        throw new Error(
            "Authenticated member profile has no memberId."
        );
    }

    const ownedWelfareData = {
        ...welfareData,
        memberId: profile.memberId,
        cooperativeId:
            profile.cooperativeId ?? null,
        status: "Pending",
        createdAt: serverTimestamp()
    };

    const docRef = await addDoc(
        collection(db, "welfare"),
        ownedWelfareData
    );

    return docRef.id;
}`
    }

];

const result = await transaction(patches);

console.log("===============================================");
console.log("RC327 PATCH RESULT");
console.log("===============================================");
console.log(JSON.stringify(result, null, 2));

if (!result?.success) {
    throw new Error(
        result?.error ||
        "RC327 Patch Engine transaction failed."
    );
}

console.log(
    "RC327 AUTHENTICATED MEMBER SERVICE TRUST BOUNDARY: PASS"
);
console.log(
    "RC327: PATCH ENGINE TRANSACTION COMPLETED"
);
