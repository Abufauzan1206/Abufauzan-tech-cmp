import { getAllMembers } from "../../../js/services/memberService.js";

const membersBody =
document.getElementById("membersBody");

const searchInput =
document.getElementById("searchMember");

const allFilter =
document.getElementById("allFilter");

const activeFilter =
document.getElementById("activeFilter");

const pendingFilter =
document.getElementById("pendingFilter");

const inactiveFilter =
document.getElementById("inactiveFilter");

const memberCount =
document.getElementById("memberCount");

let allMembers = [];

async function loadMembers() {

  try {

    const members = await getAllMembers();
    
    allMembers = members;
    
    memberCount.textContent =
`👥 Total Members: ${members.length}`;

updateFilterCounts();

    membersBody.innerHTML = "";

    if (members.length === 0) {

      membersBody.innerHTML = `
      <tr>
        <td colspan="5">
          No members registered yet.
        </td>
      </tr>`;

      return;

    }

    renderMembers(members);

  } catch (error) {

    console.error(error);

    membersBody.innerHTML = `
    <tr>
      <td colspan="5">
        Error loading members.
      </td>
    </tr>`;

  }

}

function updateFilterCounts() {

    const activeCount =
        allMembers.filter(
            member =>
            (member.status || "")
            .toLowerCase() === "active"
        ).length;

    const pendingCount =
        allMembers.filter(
            member =>
            (member.status || "")
            .toLowerCase() === "pending"
        ).length;

    const inactiveCount =
        allMembers.filter(
            member =>
            (member.status || "")
            .toLowerCase() === "inactive"
        ).length;

    allFilter.textContent =
        `All (${allMembers.length})`;

    activeFilter.textContent =
        `Active (${activeCount})`;

    pendingFilter.textContent =
        `Pending (${pendingCount})`;

    inactiveFilter.textContent =
        `Inactive (${inactiveCount})`;

}

function renderMembers(members) {

    membersBody.innerHTML = "";

    if (members.length === 0) {

        membersBody.innerHTML = `
        <tr>
            <td colspan="5">
                No matching member found.
            </td>
        </tr>`;

        return;

    }

    members.forEach(member => {

        membersBody.innerHTML += `
        <tr>

            <td>${member.memberNumber || "-"}</td>

            <td>${member.firstName ?? ""} ${member.lastName ?? ""}</td>

            <td>${member.phone || "-"}</td>

          <td>

    ${getStatusBadge(member.status)}

</td>

<td>

    <button onclick="viewMember('${member.id}')">

        View

    </button>

</td>

        </tr>`;
    });

}

function getStatusBadge(status) {

    switch (
        (status || "").toLowerCase()
    ) {

        case "active":

            return `
            <span class="status-active">
            🟢 Active
            </span>
            `;

        case "inactive":

            return `
            <span class="status-inactive">
            🔴 Inactive
            </span>
            `;

        case "pending":

            return `
            <span class="status-pending">
            🟡 Pending
            </span>
            `;

        default:

            return `
            <span class="status-pending">
            🟡 Pending
            </span>
            `;

    }

}

window.viewMember = function(memberId) {

  window.location.href =
  `../member-profile/index.html?id=${memberId}`;
  
};
loadMembers();

searchInput.addEventListener("input", () => {

    const keyword =
        searchInput.value.toLowerCase();

    const filtered =
        allMembers.filter(member => {

            return (

                (member.memberNumber || "")
                .toLowerCase()
                .includes(keyword)

                ||

                (`${member.firstName ?? ""} ${member.lastName ?? ""}`)
                .toLowerCase()
                .includes(keyword)

                ||

                (member.phone || "")
                .toLowerCase()
                .includes(keyword)

            );

        });

    renderMembers(filtered);

});

allFilter.addEventListener("click", () => {

    renderMembers(allMembers);

});

activeFilter.addEventListener("click", () => {

    const filtered = allMembers.filter(

        member =>

        (member.status || "")
        .toLowerCase() === "active"

    );

    renderMembers(filtered);

});

pendingFilter.addEventListener("click", () => {

    const filtered = allMembers.filter(

        member =>

        (member.status || "")
        .toLowerCase() === "pending"

    );

    renderMembers(filtered);

});

inactiveFilter.addEventListener("click", () => {

    const filtered = allMembers.filter(

        member =>

        (member.status || "")
        .toLowerCase() === "inactive"

    );

    renderMembers(filtered);

});