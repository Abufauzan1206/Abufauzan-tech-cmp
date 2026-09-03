import { getAuthenticatedProfile }
from "../../../js/controllers/accessController.js";

import { CMPMemberEngine }
from "../../../js/business/memberEngine.js";

const stats =
document.getElementById("stats");

async function loadMemberStatistics() {

    const session =
        await getAuthenticatedProfile();

    if (!session) {
        return;
    }

    const cooperativeId =
        typeof session.profile?.cooperativeId === "string"
            ? session.profile.cooperativeId.trim()
            : "";

    if (!cooperativeId) {
        if (stats) {
            stats.innerHTML =
                "<p>Cooperative ownership is not configured.</p>";
        }
        return;
    }

    const members =
        await CMPMemberEngine
            .getByCooperativeId(cooperativeId);

    const total =
        members.length;

    const active =
        members.filter(
            member => member.status === "active"
        ).length;

    const inactive =
        members.filter(
            member => member.status === "inactive"
        ).length;

    const pending =
        members.filter(
            member => member.status === "pending"
        ).length;

    stats.innerHTML = `
<div class="card">
<h2>Total Members</h2>
<h1>${total}</h1>
</div>

<div class="card">
<h2>Active Members</h2>
<h1>${active}</h1>
</div>

<div class="card">
<h2>Inactive Members</h2>
<h1>${inactive}</h1>
</div>

<div class="card">
<h2>Pending Approval</h2>
<h1>${pending}</h1>
</div>
`;
}

loadMemberStatistics();
