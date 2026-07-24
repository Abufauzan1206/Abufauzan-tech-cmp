import {
    getGroupBoxes,
    getDrawBox,
    reserveMonth,
    releaseMonth
}
from "../../../js/services/drawBoxService.js";

import {
    createReservation,
    getGroupReservations,
    deleteReservation
}
from "../../../js/services/drawReservationService.js";

const params =
new URLSearchParams(
    window.location.search
);

const groupId =
params.get("id");

const monthsContainer =
document.getElementById(
    "monthsContainer"
);

async function handleReservation(event) {

    const button = event.target;

    const boxId =
    button.dataset.boxId;

    try {

    // Replace with your authenticated admin ID later
    const adminId = "ADMIN";

const participantId = prompt(

    "Enter participant ID:"

);

if(!participantId){

    alert("Reservation cancelled.");

    return;

}

const participantName = prompt(

    "Enter participant's name:"

);

if(!participantName){

    alert("Reservation cancelled.");

    return;

}

await reserveMonth(

    boxId,

    adminId

);

const box = await getDrawBox(
    boxId
);

await createReservation({

    groupId,

    boxId,

    participantId:

    participantName,

    participantName,

    month: box.month,

    year: box.year,

    reservedBy: adminId

});

await loadMonths();

}

catch(error) {

    console.error(error);

    alert("Unable to reserve month.");

}

}

async function loadMonths() {

    if (!groupId) {

        monthsContainer.innerHTML =
        "No draw group selected.";

        return;

    }

    try {

        const boxes =
        await getGroupBoxes(
            groupId
        );
        
        const reservations =
await getGroupReservations(
    groupId
);

        if (boxes.length === 0) {

            monthsContainer.innerHTML =
            "No prepared boxes found.";

            return;

        }

        monthsContainer.innerHTML = "";

        boxes.forEach(box => {

    const reservation =
    reservations.find(

        r => r.boxId === box.id

    );

    monthsContainer.innerHTML += `

    <div class="month-card">

        <h3>

${box.month} ${box.year}

</h3>

<p>

Status:
${reservation ? "🔒 Reserved" : "✅ Available"}

<br>

Reserved For:

${reservation ? reservation.participantName : "Not Assigned"}

</p>

        ${reservation ?

`<button
class="release-btn"
data-reservation-id="${reservation.id}"
data-box-id="${box.id}">

Release

</button>`

:

`<button
class="reserve-btn"
data-box-id="${box.id}"
data-month="${box.month}"
data-year="${box.year}">

Reserve

</button>`

}

    </div>

    `;

});

document.querySelectorAll(".reserve-btn")
.forEach(button => {

    button.addEventListener(
        "click",
        handleReservation
    );

});

document.querySelectorAll(".release-btn")
.forEach(button => {

    button.addEventListener(

        "click",

        async (event) => {

            const reservationId =
event.target.dataset.reservationId;

const boxId =
event.target.dataset.boxId;

const proceed =
confirm(
    "Release this reservation?"
);

if(!proceed){

    return;

}

await releaseMonth(
    boxId
);

await deleteReservation(
    reservationId
);

await loadMonths();

        }

    );

});

}

catch(error) {

    console.error(error);

    monthsContainer.innerHTML =
    "Unable to load months.";

}

}

loadMonths();