import {
    getMembers
}
from "../../../js/services/memberService.js";

import {
    addParticipantToGroup,
    participantExists
}
from "../../../js/services/drawParticipantService.js";

import {
    getDrawGroupById
}
from "../../../js/services/drawGroupService.js";

import {
    createDrawBox
}
from "../../../js/services/drawBoxService.js";

const params =
new URLSearchParams(
    window.location.search
);

const groupId =
params.get("id");

const groupName =
document.getElementById(
    "groupName"
);

const memberBody =
document.getElementById(
    "memberBody"
);

async function loadPage() {

    try {

        const group =
await getDrawGroupById(
    groupId
);

window.currentGroup =
group;

console.log(group);

groupName.textContent =
group.groupName;

        const members =
        await getMembers();

        if (
            members.length === 0
        ) {

            memberBody.innerHTML = `
            <tr>
                <td colspan="3">
                    No members found.
                </td>
            </tr>
            `;

            return;

        }

        memberBody.innerHTML = "";

        members.forEach(member => {

            memberBody.innerHTML += `
            <tr>

                <td>
                    ${member.memberNumber}
                </td>

                <td>
                    ${member.firstName}
                    ${member.lastName}
                </td>

                <td>

                    <button
                    onclick="addToGroup('${member.id}')">

                    ➕

                    Add

                    </button>

                </td>

            </tr>
            `;

        });

    } catch(error) {

        console.error(error);

    }

}

window.addToGroup =
async function(memberId) {

    try {

        const members =
        await getMembers();

        const member =
        members.find(

            m => m.id === memberId

        );

        if (!member) {

            alert(
                "Member not found."
            );

            return;

        }
        
        const exists =
await participantExists(
    groupId,
    member.id
);

if (exists) {

    alert(
        "Member already belongs to this group."
    );

    return;

}

        const slotCount = Number(

    prompt(

        `Enter number of slots (Max ${window.currentGroup.maxSlotsPerMember})`,

        "1"

    )

);

if (

    !slotCount ||

    slotCount < 1

) {

    return;

}

if (

    slotCount >

    window.currentGroup.maxSlotsPerMember

) {

    alert(

        `Maximum allowed is ${window.currentGroup.maxSlotsPerMember}`

    );

    return;

}

await addParticipantToGroup({

    groupId,

    memberId:
    member.id,

    memberNumber:
    member.memberNumber,

    fullName:
    `${member.firstName} ${member.lastName}`,

    slotCount

});

for (let i = 0; i < slotCount; i++) {

    await createDrawBox({

        groupId,

        memberId: member.id,

        memberNumber: member.memberNumber,

        fullName:
        `${member.firstName} ${member.lastName}`

    });

}

        alert(
            "Participant added successfully."
        );

    } catch(error) {

        console.error(error);

        alert(
            "Unable to add participant."
        );

    }

};

loadPage();