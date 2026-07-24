import {
    getReservationByParticipant
}
from "../../../js/services/drawReservationService.js";

import {

    getGroupBoxes,

    getDrawBox,

    getBoxByMonth,

    swapMonths,

    revealDrawBox

}
from "../../../js/services/drawBoxService.js";

const params =
new URLSearchParams(
window.location.search
);

const groupId =
params.get("id");

const boxesContainer =
document.getElementById(
"boxesContainer"
);

// Temporary.
// Will later come from Firebase Authentication.

const participantName = prompt(

    "Enter your name"

);

const currentUser = {

    id: participantName,

    role: "participant"

};

async function handleBoxClick(event){

    const boxId =
    event.currentTarget.dataset.boxId;

    const box =
await getDrawBox(boxId);

const reservation =
await getReservationByParticipant(

    groupId,

    currentUser.id

);

if (reservation) {

    const reservedBox =
    await getBoxByMonth(

        groupId,

        reservation.month,

        reservation.year

    );

    if (

        reservedBox &&

        reservedBox.id !== boxId

    ) {

        await swapMonths(

            boxId,

            reservedBox.id

        );

    }

}

console.log(box);

    if(box.locked){

        alert("This box has already been opened.");

        return;

    }

    if(

    box.reserved &&

    currentUser.role !== "admin" &&

    !reservation

){

    alert("Reserved box");

    return;

}

    try{

        await revealDrawBox(

    boxId,

    currentUser.id

);

const finalBox =
await getDrawBox(boxId);

console.log(
    "Final box after swap:",
    finalBox
);

        const updatedBox =
        await getDrawBox(boxId);

        console.log(updatedBox);

        alert(

            updatedBox.month +
            " " +
            updatedBox.year

        );

        await loadBoxes();

    }catch(error){

        console.error(error);

        alert(error.message);

        return;

    }

}

async function loadBoxes(){

    if(!groupId){

        boxesContainer.innerHTML =
        "No draw group selected.";

        return;

    }

    const boxes =
    await getGroupBoxes(
        groupId
    );

    boxesContainer.innerHTML = "";

    boxes.forEach(box=>{

        if(box.locked){

            boxesContainer.innerHTML += `

<div
class="draw-box locked"
data-box-id="${box.id}">

<div class="revealed-month">

${box.month}

</div>

<div class="revealed-year">

${box.year}

</div>

</div>

`;

        }else{

            boxesContainer.innerHTML += `

<div
class="draw-box"
data-box-id="${box.id}">

<div class="gift-icon">

📦

</div>

<div class="box-number">

${box.displayNumber}

</div>

</div>

`;

        }

    });

    document
    .querySelectorAll(".draw-box")
    .forEach(box=>{

        box.addEventListener(

            "click",

            handleBoxClick

        );

    });

}

loadBoxes();