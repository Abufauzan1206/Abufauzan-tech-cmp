import { CMP } from "../../js/core/app.js";

import { CMPHealthService }
from "../../js/core/healthService.js";

const dashboard =
document.getElementById("dashboard");

const health =
CMPHealthService.getStatus();

dashboard.innerHTML = `

<div class="card">

<h2>Framework</h2>

<p>Status: 🟢 ${health.framework}</p>

<p>Version: ${CMP.version}</p>

<p>Initialized: ${CMP.initialized}</p>

</div>

<div class="card">

<h2>Services</h2>

<p>Registered:
${Object.keys(CMP.services).length}</p>

</div>

<div class="card">

<h2>Modules</h2>

<p>Loaded:
${Object.keys(CMP.modules).length}</p>

</div>

<div class="card">

<h2>Health</h2>

<p>Cache:
${health.cache}</p>

<p>Services:
${health.services}</p>

</div>

`;