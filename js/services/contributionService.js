import { db } from "../firebase-config.js";

// import { CMPTransactionEngine }
// from "../business/transactionEngine.js";

import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    serverTimestamp
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

export async function recordContribution(
    contributionData
) {

    contributionData.createdAt =
        serverTimestamp();

    const docRef = await addDoc(
        collection(db, "contributions"),
        contributionData
    );
    
   /*
   CMPTransactionEngine.create({

    type:
    CMPTransactionEngine
    .TYPES
    .CONTRIBUTION,

    memberId:
    contributionData.memberId,

    amount:
    contributionData.amount,

    debitCredit:
    "CREDIT",

    description:
`Contribution by member ${contributionData.memberId}`

});*/

    return docRef.id;

}

export async function getMemberContributions(
    memberId
) {

    const q = query(
        collection(db, "contributions"),
        where("memberId", "==", memberId)
    );

    const snapshot =
        await getDocs(q);

    const contributions = [];

    snapshot.forEach(doc => {

        contributions.push({

            id: doc.id,

            ...doc.data()

        });

    });

    return contributions;

}

export async function
getContributionSummary(memberId) {

    const contributions =
        await getMemberContributions(
            memberId
        );

    const totalAmount =
        contributions.reduce(

            (sum, contribution) =>

                sum +
                Number(
                    contribution.amount || 0
                ),

            0

        );

    return {

        totalContributions:
            contributions.length,

        totalAmount

    };

}