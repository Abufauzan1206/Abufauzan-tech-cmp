import {
    createDrawGroup
}
from "../../../js/services/drawGroupService.js";

import {
    getFunctions,
    httpsCallable
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-functions.js";

import {
    auth,
    db
}
from "../../../js/firebase-config.js";

import {
    doc,
    getDoc
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const functions = getFunctions();

const getActiveCooperativesCallable =
    httpsCallable(
        functions,
        "getActiveCooperatives"
    );

const cooperativeSelect =
    document.getElementById(
        "cooperativeId"
    );

async function loadCooperatives() {
    const user = auth.currentUser;

    if (!user) {
        throw new Error(
            "You must be signed in."
        );
    }

    const profileSnap =
        await getDoc(
            doc(
                db,
                "users",
                user.uid
            )
        );

    if (!profileSnap.exists()) {
        throw new Error(
            "User profile not found."
        );
    }

    const profile =
        profileSnap.data();

    if (
        profile.role ===
        "cooperative_admin"
    ) {
        if (
            typeof profile.cooperativeId !==
            "string" ||
            !profile.cooperativeId.trim()
        ) {
            throw new Error(
                "Cooperative ownership is not configured."
            );
        }

        cooperativeSelect.innerHTML =
            "";

        const option =
            document.createElement(
                "option"
            );

        option.value =
            profile.cooperativeId.trim();

        option.textContent =
            profile.cooperativeId.trim();

        cooperativeSelect.appendChild(
            option
        );

        cooperativeSelect.disabled =
            true;

        return;
    }

    if (
        profile.role !==
        "super_admin"
    ) {
        throw new Error(
            "Only authorized administrators can create draw groups."
        );
    }

    const result =
        await getActiveCooperativesCallable();

    if (
        !result?.data?.success ||
        !Array.isArray(
            result.data.cooperatives
        )
    ) {
        throw new Error(
            "Unable to load active cooperatives."
        );
    }

    cooperativeSelect.innerHTML =
        '<option value="">Select cooperative</option>';

    result.data.cooperatives.forEach(
        (cooperative) => {
            const option =
                document.createElement(
                    "option"
                );

            option.value =
                cooperative.cooperativeId;

            option.textContent =
                cooperative.cooperativeName +
                " (" +
                cooperative.cooperativeId +
                ")";

            cooperativeSelect.appendChild(
                option
            );
        }
    );
}

loadCooperatives().catch(
    (error) => {
        console.error(error);
        alert(error.message);
    }
);

const groupForm =
document.getElementById(
    "groupForm"
);

groupForm.addEventListener(
    "submit",

    async function(event) {

        event.preventDefault();

        try {

            const cooperativeId =
                document.getElementById(
                    "cooperativeId"
                ).value.trim();

            if (!cooperativeId) {
                throw new Error(
                    "A cooperative must be selected."
                );
            }

            const groupData = {

                cooperativeId,

                groupName:

                document.getElementById(
                    "groupName"
                ).value,

                startMonth:

                document.getElementById(
                    "startMonth"
                ).value,

                startYear:

                Number(

                    document.getElementById(
                        "startYear"
                    ).value

                ),

                maxSlots:

Number(

    document.getElementById(
        "maxSlots"
    ).value

),

maxSlotsPerMember:

Number(

    document.getElementById(
        "maxSlotsPerMember"
    ).value

),

drawPreparationPolicy:

document.getElementById(
    "drawPreparationPolicy"
).value,

            };

            await createDrawGroup(
                groupData
            );

            alert(
                "Draw Group Created Successfully"
            );

            groupForm.reset();

        } catch(error) {

            console.error(error);

            alert(
                "Unable to create draw group."
            );

        }

    }
);