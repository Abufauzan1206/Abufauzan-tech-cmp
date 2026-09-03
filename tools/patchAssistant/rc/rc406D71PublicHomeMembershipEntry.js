import { patch } from "../patchEngine.js";

const result = await patch({
    path: "index.html",
    search: `    <a href="login.html">
        <button class="btn-primary">
            🚀 Get Started
        </button>
    </a>

    <p class="version">`,
    replace: `    <a href="login.html">
        <button class="btn-primary">
            🚀 Get Started
        </button>
    </a>

    <div class="public-entry-actions">

        <a href="register-cooperative.html">
            <button type="button" class="btn-primary">
                🏢 Register Cooperative
            </button>
        </a>

        <a href="modules/membership-application/index.html">
            <button type="button" class="btn-primary">
                👤 Apply for Membership
            </button>
        </a>

    </div>

    <p class="version">`
});

console.log(
    "RC406-D71 PUBLIC HOME PATCH RESULT:",
    JSON.stringify(result, null, 2)
);
