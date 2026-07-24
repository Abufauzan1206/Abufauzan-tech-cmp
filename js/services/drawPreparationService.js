import {
    generateMonths
}
from "./monthGeneratorService.js";

import {
    shuffleArray
}
from "./drawShuffleService.js";

import {
    updateBoxAssignment
}
from "./drawBoxService.js";

export function assignMonthsToBoxes(

    group,
    boxes

) {

    const months = generateMonths(

        group.startMonth,

        group.startYear,

        boxes.length

    );

    const shuffledMonths =
    shuffleArray(months);

    return boxes.map(

    (box, index) => ({

        ...box,

        month:
        shuffledMonths[index].month,

        year:
        shuffledMonths[index].year,

        status: "Ready",

        picked: false,

        pickedBy: null,

        pickedAt: null,

        locked: false,

        lockedBy: null,

        lockedAt: null

    })

);

}

export async function saveAssignments(

    assignments

) {

    for (

        const assignment

        of assignments

    ) {

        await updateBoxAssignment(

            assignment.id,

            assignment.month,

            assignment.year

        );

    }

}