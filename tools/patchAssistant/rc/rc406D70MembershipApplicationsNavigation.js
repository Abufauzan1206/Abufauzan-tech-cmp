import { patch } from "../patchEngine.js";

const result = await patch({
    path: "modules/members/index.html",
    search: `<a href="../member-registration/index.html" class="service-card">

<div class="service-icon">📝</div>

<h3>Register Member</h3>

<p>Add a new cooperative member.</p>

</a>

<a href="member-directory/index.html" class="service-card">`,
    replace: `<a href="../member-registration/index.html" class="service-card">

<div class="service-icon">📝</div>

<h3>Register Member</h3>

<p>Add a new cooperative member.</p>

</a>

<a href="membership-applications/index.html" class="service-card">

<div class="service-icon">📥</div>

<h3>Membership Applications</h3>

<p>Review pending membership applications.</p>

</a>

<a href="member-directory/index.html" class="service-card">`
});

console.log(
    "RC406-D70 NAVIGATION PATCH RESULT:",
    JSON.stringify(result, null, 2)
);
