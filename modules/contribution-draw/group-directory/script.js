import {
    getDrawGroups
}
from "../../../js/services/drawGroupService.js";

const groupBody =
document.getElementById(
    "groupBody"
);

const groupCount =
document.getElementById(
    "groupCount"
);

async function loadGroups() {

    try {

        const groups =
        await getDrawGroups();

        groupCount.textContent =
        `📦 Total Groups: ${groups.length}`;

        if (groups.length === 0) {

            groupBody.innerHTML = `
            <tr>
                <td colspan="5">
                    No groups found.
                </td>
            </tr>
            `;

            return;

        }

        groupBody.innerHTML = "";

        groups.forEach(group => {

            groupBody.innerHTML += `
            <tr>

                <td>
                    ${group.groupName}
                </td>

                <td>
                    ${group.startMonth}
                    ${group.startYear}
                </td>

                <td>
                    ${group.maxParticipants}
                </td>

                <td>
                    ${group.status}
                </td>

                <td>

                    <button
onclick="viewGroup('${group.id}')">

    View

</button>

               </td>

            </tr>
            `;

        });

    } catch(error) {

        console.error(error);

        groupBody.innerHTML = `
        <tr>
            <td colspan="5">
                Error loading groups.
            </td>
        </tr>
        `;

    }

}

loadGroups();

window.viewGroup =
function(groupId) {

    window.location.href =

    `../group-profile/index.html?id=${groupId}`;

};