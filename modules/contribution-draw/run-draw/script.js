import { auth } from "../../../js/firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    getGroupBoxes,
    executeDraw
} from "../../../js/services/drawBoxService.js";

import {
    getGroupReservations
} from "../../../js/services/drawReservationService.js";

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

let reservations = [];
let selectedReservationId = null;
let drawBusy = false;

function showMessage(message) {
    boxesContainer.innerHTML = "";
    const paragraph = document.createElement("p");
    paragraph.textContent = message;
    boxesContainer.appendChild(paragraph);
}

function buildReservationSelector() {
    const existing =
        document.getElementById(
            "reservationSelector"
        );

    if (existing) {
        existing.remove();
    }

    const wrapper =
        document.createElement("div");

    wrapper.id =
        "reservationSelector";

    const label =
        document.createElement("label");

    label.textContent =
        "Participant reservation:";

    const select =
        document.createElement("select");

    select.id =
        "reservationSelect";

    const placeholder =
        document.createElement("option");

    placeholder.value = "";
    placeholder.textContent =
        "Select a reserved participant";
    placeholder.disabled = true;
    placeholder.selected = true;

    select.appendChild(
        placeholder
    );

    reservations.forEach(
        reservation => {
            const option =
                document.createElement(
                    "option"
                );

            option.value =
                reservation.id;

            option.textContent =
                reservation.participantName ||
                reservation.participantId;

            select.appendChild(
                option
            );
        }
    );

    select.addEventListener(
        "change",
        event => {
            selectedReservationId =
                event.target.value || null;
        }
    );

    wrapper.appendChild(label);
    wrapper.appendChild(select);

    boxesContainer.before(wrapper);
}

async function handleBoxClick(event) {
    if (drawBusy) {
        return;
    }

    if (!selectedReservationId) {
        alert(
            "Select a reserved participant before executing the draw."
        );
        return;
    }

    const selectedBoxId =
        event.currentTarget.dataset.boxId;

    const box =
        await getGroupBoxes(groupId);

    const selectedBox =
        box.find(
            item => item.id === selectedBoxId
        );

    if (!selectedBox) {
        alert(
            "Selected draw box was not found."
        );
        return;
    }

    if (selectedBox.locked) {
        alert(
            "This box has already been opened."
        );
        return;
    }

    const reservation =
        reservations.find(
            item =>
                item.id ===
                selectedReservationId
        );

    if (!reservation) {
        alert(
            "Selected reservation is no longer available."
        );
        return;
    }

    const proceed =
        confirm(
            "Execute this draw for " +
            (reservation.participantName ||
                reservation.participantId) +
            "?"
        );

    if (!proceed) {
        return;
    }

    drawBusy = true;

    try {
        const result =
            await executeDraw(
                groupId,
                reservation.id,
                selectedBoxId
            );

        alert(
            "Draw completed: " +
            result.month +
            " " +
            result.year
        );

        await loadDrawState();
    } catch (error) {
        console.error(error);
        alert(
            error.message ||
            "Unable to execute draw."
        );
    } finally {
        drawBusy = false;
    }
}

async function loadDrawState() {
    if (!groupId) {
        showMessage(
            "No draw group selected."
        );
        return;
    }

    try {
        reservations =
            await getGroupReservations(
                groupId
            );

        const boxes =
            await getGroupBoxes(
                groupId
            );

        if (reservations.length === 0) {
            showMessage(
                "No active reservations are available for this draw."
            );
            return;
        }

        buildReservationSelector();

        boxesContainer.innerHTML = "";

        boxes.forEach(box => {
            const element =
                document.createElement(
                    "div"
                );

            element.dataset.boxId =
                box.id;

            if (box.locked) {
                element.className =
                    "draw-box locked";

                element.innerHTML =
                    '<div class="revealed-month">' +
                    box.month +
                    '</div>' +
                    '<div class="revealed-year">' +
                    box.year +
                    '</div>';
            } else {
                element.className =
                    "draw-box";

                element.innerHTML =
                    '<div class="gift-icon">📦</div>' +
                    '<div class="box-number">' +
                    box.displayNumber +
                    '</div>';

                element.addEventListener(
                    "click",
                    handleBoxClick
                );
            }

            boxesContainer.appendChild(
                element
            );
        });
    } catch (error) {
        console.error(error);
        showMessage(
            error.message ||
            "Unable to load draw state."
        );
    }
}

onAuthStateChanged(
    auth,
    async user => {
        if (!user) {
            window.location.href =
                "../login.html";
            return;
        }

        await loadDrawState();
    }
);