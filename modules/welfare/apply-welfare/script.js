import {
    applyWelfare
}
from "../../../js/services/welfareService.js";

const welfareForm =
document.getElementById(
    "welfareForm"
);

welfareForm.addEventListener(

    "submit",

    async (e) => {

        e.preventDefault();

        try {

            await applyWelfare({

                memberId:
                document.getElementById(
                    "memberId"
                ).value,

                requestType:
                document.getElementById(
                    "requestType"
                ).value,

                amount:
                Number(
                    document.getElementById(
                        "amount"
                    ).value
                ),

                reason:
                document.getElementById(
                    "reason"
                ).value

            });

            alert(
                "Welfare request submitted successfully."
            );

            welfareForm.reset();

        } catch (error) {

            console.error(error);

            alert(
                "Unable to submit welfare request."
            );

        }

    }

);