import { db } from "../firebase-config.js";

import {
collection,
addDoc,
getDocs,
query,
where,
serverTimestamp,
doc,
updateDoc
}

from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

export async function applyLoan(
    loanData
) {

    loanData.status =
        "Pending";

    loanData.createdAt =
        serverTimestamp();

    const docRef = await addDoc(
        collection(db, "loans"),
        loanData
    );

    return docRef.id;

}

export async function getMemberLoans(
    memberId
) {

    const q = query(
        collection(db, "loans"),
        where("memberId", "==", memberId)
    );

    const snapshot =
        await getDocs(q);

    const loans = [];

    snapshot.forEach(doc => {

        loans.push({

            id: doc.id,

            ...doc.data()

        });

    });

    return loans;

}

export async function getLoanSummary(
    memberId
) {

    const loans =
        await getMemberLoans(
            memberId
        );

    const totalAmount =
        loans.reduce(

            (sum, loan) =>

                sum +
                Number(
                    loan.amount || 0
                ),

            0

        );

    return {

        totalLoans:
            loans.length,

        totalAmount

    };
    
}

export async function getApprovedLoans(
    memberId
) {

    const loans =
        await getMemberLoans(
            memberId
        );

    return loans.filter(
        loan =>
        loan.status === "Approved"
    );

}
    
export async function getLoans() {

    const snapshot =
        await getDocs(
            collection(db, "loans")
        );

    const loans = [];

    snapshot.forEach(doc => {

        loans.push({

            id: doc.id,

            ...doc.data()

        });

    });

    return loans;

}

export async function updateLoanStatus(
    loanId,
    status
) {

    await updateDoc(

        doc(
            db,
            "loans",
            loanId
        ),

        {
            status
        }

    );

}


