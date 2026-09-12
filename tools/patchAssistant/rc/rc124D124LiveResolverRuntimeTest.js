import { transaction } from "../patchEngine.js";

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC406-D124 - LIVE RESOLVER RUNTIME HARNESS");
    console.log("=========================================");

    const result = await transaction([
        {
            path: "testD124LiveResolverRuntime.html",
            mode: "create",
            replace: `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>D124 Live Resolver Runtime</title>
</head>
<body>
<pre id="output">Running...</pre>

<script type="module">
import { auth } from "./js/firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
    getAccountingPeriodByDate
} from "./js/services/accountingPeriodService.js";

const output =
    document.getElementById("output");

function print(value) {
    output.textContent += value + "\\n";
}

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        output.textContent =
            "D124 LIVE RESOLVER: AUTHENTICATION FAIL";
        return;
    }

    try {

        output.textContent = "";

        print(
            "D124 LIVE RESOLVER RUNTIME"
        );

        print(
            "AUTHENTICATION: PASS"
        );

        print(
            "TARGET DATE: 2026-09-10"
        );

        const period =
            await getAccountingPeriodByDate(
                "2026-09-10"
            );

        print(
            "LIVE RESOLVER RESULT:"
        );

        print(
            JSON.stringify(
                {
                    id: period?.id ?? null,
                    name: period?.name ?? null,
                    startDate:
                        period?.startDate ?? null,
                    endDate:
                        period?.endDate ?? null,
                    financialYearId:
                        period?.financialYearId ?? null,
                    status:
                        period?.status ?? null,
                    locked:
                        period?.locked ?? null
                },
                null,
                2
            )
        );

        if (
            period &&
            period.financialYearId
        ) {
            print(
                "D124 RUNTIME RESULT: PASS"
            );
        } else {
            print(
                "D124 RUNTIME RESULT: FAIL"
            );
        }

    } catch (error) {

        output.textContent =
            "D124 LIVE RESOLVER: FAIL\\n" +
            (
                error?.stack ||
                error?.message ||
                String(error)
            );
    }
});
</script>
</body>
</html>`
        }
    ]);

    console.log(
        "RC124 RUNTIME HARNESS RESULT:"
    );

    console.log(
        JSON.stringify(
            result,
            null,
            2
        )
    );

    if (!result.success) {
        process.exitCode = 1;

        console.log(
            "========================================="
        );

        console.log(
            "RC124 RUNTIME HARNESS CREATE FAIL"
        );

        console.log(
            "========================================="
        );

        return;
    }

    console.log(
        "========================================="
    );

    console.log(
        "RC124 RUNTIME HARNESS CREATED"
    );

    console.log(
        "========================================="
    );
}

run();
