import {
    getGroupBoxes
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

async function loadBoxes() {

    if (!groupId) {

        boxesContainer.innerHTML =
        "No draw group selected.";

        return;

    }

    try {

        const boxes =
        await getGroupBoxes(
            groupId
        );

        if (boxes.length === 0) {

            boxesContainer.innerHTML = `
            <p>
            No boxes have been created yet.
            </p>
            `;

            return;

        }

        boxesContainer.innerHTML = "";

        boxes.forEach(

            (box, index) => {

                boxesContainer.innerHTML += `

                <div
                style="
                border:1px solid #ccc;
                padding:15px;
                margin-bottom:10px;
                border-radius:8px;
                ">

                <h3>

                📦 Box ${box.displayNumber}

                </h3>

                <p>

                <strong>Owner:</strong>

                ${box.fullName}

                </p>

                ${box.status === "Picked" ? `

<p>

<strong>Month:</strong>

${box.month} ${box.year}

</p>

` : `

<p>

<strong>Status:</strong>

${box.status}

</p>

`}

                </div>

                `;

            }

        );

    } catch(error) {

        console.error(error);

        boxesContainer.innerHTML =
        "Unable to load boxes.";

    }

}

loadBoxes();