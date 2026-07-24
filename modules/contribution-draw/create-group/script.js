import {
    createDrawGroup
}
from "../../../js/services/drawGroupService.js";

const groupForm =
document.getElementById(
    "groupForm"
);

groupForm.addEventListener(
    "submit",

    async function(event) {

        event.preventDefault();

        try {

            const groupData = {

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