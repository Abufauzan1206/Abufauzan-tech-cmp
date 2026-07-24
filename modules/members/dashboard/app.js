import { CMPMemberEngine }
from "../../../js/business/memberEngine.js";

const stats =
document.getElementById("stats");

const members =
CMPMemberEngine.getAll();

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