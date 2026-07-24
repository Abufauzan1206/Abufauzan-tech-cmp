import {
    getDrawGroupById,
    updateGroupStatus
}
from "../../../js/services/drawGroupService.js";

import {
    getGroupParticipants,
    getUsedSlots
}
from "../../../js/services/drawParticipantService.js";

import {
    getGroupBoxes,
    revealDrawBox
}
from "../../../js/services/drawBoxService.js";

import {
    assignMonthsToBoxes,
    saveAssignments
}
from "../../../js/services/drawPreparationService.js";

const params =
new URLSearchParams(
    window.location.search
);

const groupId =
params.get("id");

const participantsBtn =
document.getElementById(
    "participantsBtn"
);

const openRegistrationBtn =
document.getElementById(
    "openRegistrationBtn"
);

const closeRegistrationBtn =
document.getElementById(
    "closeRegistrationBtn"
);

const prepareDrawBtn =
document.getElementById(
    "prepareDrawBtn"
);

const runDrawBtn =
document.getElementById(
    "runDrawBtn"
);

const boxesBtn =
document.getElementById(
    "boxesBtn"
);

const reservedMonthsBtn =
document.getElementById(
    "reservedMonthsBtn"
);

openRegistrationBtn.addEventListener(

    "click",

    async () => {

        try {

            await updateGroupStatus(

                groupId,

                "Registration Open"

            );

            alert(

                "Registration is now open."

            );

            location.reload();

        } catch (error) {

            console.error(error);

            alert(

                "Unable to open registration."

            );

        }

    }

);

closeRegistrationBtn.addEventListener(

    "click",

    async () => {

        const proceed = confirm(

            "Close Registration?\n\nNo additional participants will be able to join this draw group."

        );

        if (!proceed) {

            return;

        }

        try {

            await updateGroupStatus(

                groupId,

                "Registration Closed"

            );

            alert(

                "Registration has been closed."

            );

            location.reload();

        }

        catch (error) {

            console.error(error);

            alert(

                "Unable to close registration."

            );

        }

    }

);

prepareDrawBtn.addEventListener(

    "click",

    async () => {

        try {

            const group =
            await getDrawGroupById(
                groupId
            );

            const usedSlots =
            await getUsedSlots(
                groupId
            );

            if (

                group.drawPreparationPolicy ===
                "Full Capacity"

            ) {

                if (

                    usedSlots <
                    group.maxSlots

                ) {

                    alert(

`Draw cannot be prepared.

${group.maxSlots - usedSlots} slot(s) are still vacant.`

                    );

                    return;

                }

            }

            const boxes =
await getGroupBoxes(
    groupId
);

const assignments =
assignMonthsToBoxes(
    group,
    boxes
);

await saveAssignments(
    assignments
);

await updateGroupStatus(

    groupId,

    "Draw Ready"

);

alert(

    "🎉 Draw prepared successfully."

);

location.reload();

        }

        catch(error) {

            console.error(error);

            alert(

                "Unable to validate draw."

            );

        }

    }

);

runDrawBtn.addEventListener(

    "click",

    () => {

        window.location.href =

        `../run-draw/index.html?id=${groupId}`;

    }

);

participantsBtn.addEventListener(
    "click",

    () => {

        window.location.href =

        `../group-participants/index.html?id=${groupId}`;

    }
);

boxesBtn.addEventListener(

    "click",

    () => {

        window.location.href =

        `../boxes/index.html?id=${groupId}`;

    }

);

reservedMonthsBtn.addEventListener(

    "click",

    () => {

        window.location.href =

        `../reservations/index.html?id=${groupId}`;

    }

);

async function loadGroup() {

    if (!groupId) {

        alert(
            "No group selected."
        );

        return;

    }

    try {

const group =
await getDrawGroupById(
    groupId
);

        if (!group) {

            alert(
                "Group not found."
            );

            return;

        }

        document.getElementById(
            "groupName"
        ).textContent =

        group.groupName;

        document.getElementById(
            "startPeriod"
        ).textContent =

        `${group.startMonth} ${group.startYear}`;

        document.getElementById(
    "maxSlots"
).textContent =

group.maxSlots || 0;

document.getElementById(
    "maxSlotsPerMember"
).textContent =

group.maxSlotsPerMember || 1;

        document.getElementById(
            "groupStatus"
        ).textContent =

        group.status;
        
        openRegistrationBtn.style.display = "none";

closeRegistrationBtn.style.display = "none";

prepareDrawBtn.style.display = "none";

runDrawBtn.style.display = "none";

switch (group.status) {

    case "Draft":
        openRegistrationBtn.style.display = "inline-block";
        break;

    case "Registration Open":
        closeRegistrationBtn.style.display = "inline-block";
        break;

    case "Registration Closed":
        prepareDrawBtn.style.display = "inline-block";
        break;
        
        case "Draw Ready":
    runDrawBtn.style.display = "inline-block";
    break;

}
        
        const participants =
await getGroupParticipants(
    groupId
);

const usedSlots =
await getUsedSlots(
    groupId
);

document.getElementById(
    "participantCount"
).textContent =

participants.length;

document.getElementById(
    "usedSlots"
).textContent =

usedSlots;

document.getElementById(
    "remainingSlots"
).textContent =

(group.maxSlots || 0) - usedSlots;

document.getElementById(
    "groupProfile"
).style.display = "block";

} catch (error) {

    console.error(error);

    alert(error.message);

}

}

loadGroup();