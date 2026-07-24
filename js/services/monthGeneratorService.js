const months = [

    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"

];

export function generateMonths(

    startMonth,
    startYear,
    totalSlots

) {

    const generatedMonths = [];

    let monthIndex =
    months.indexOf(startMonth);

    let year = startYear;

    for (

        let i = 0;

        i < totalSlots;

        i++

    ) {

        generatedMonths.push({

            month: months[monthIndex],

            year

        });

        monthIndex++;

        if (monthIndex > 11) {

            monthIndex = 0;

            year++;

        }

    }

    return generatedMonths;

}