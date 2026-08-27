import { transaction } from "../patchEngine.js";

const loginFormAnchor = `<form id="loginForm">`;

const loginFormReplacement = `<form id="loginForm">

<div
id="loginAsContainer"
style="margin-bottom:20px;">

<label
for="loginAsRole"
style="display:block;margin-bottom:8px;font-weight:600;">

Login as

</label>

<select
id="loginAsRole"
required
style="width:100%;padding:12px;border:1px solid #CBD5E1;border-radius:8px;">

<option value="" selected disabled>
Select access category
</option>

<option value="cooperative_admin">
Cooperative Admin
</option>

<option value="member">
Member
</option>

</select>

</div>`;

const authImportAnchor =
`import { rolesMatch } from "./components/roleAuthorization.js";`;

const authImportReplacement =
`import { rolesMatch } from "./components/roleAuthorization.js";
import { resolveAccess } from "./controllers/accessController.js";`;

const authRoutingAnchor = `      alert("Login successful!");

      if (
            rolesMatch(userData.role, "super_admin")
        ) {
            window.location.href = "super-admin.html";
        } else if (
            rolesMatch(userData.role, "cooperative_admin")
        ) {
            window.location.href = "cooperative-admin.html";
        } else if (
            rolesMatch(userData.role, "member")
        ) {
            window.location.href = "modules/member-portal/index.html";
        } else {
            alert("Unsupported user role: " + userData.role);
        }`;

const authRoutingReplacement = `      alert("Login successful!");

      /*
       * Super Admin is automatic and is never selectable
       * through the Login-as control.
       */
      if (rolesMatch(userData.role, "super_admin")) {
          const access = await resolveAccess();

          if (!access.allowed) {
              alert(access.reason);
              return;
          }

          window.location.href = access.destination;
          return;
      }

      const loginAsRole =
          document.getElementById("loginAsRole")?.value || null;

      const access = await resolveAccess(loginAsRole);

      if (!access.allowed) {
          alert(access.reason);
          return;
      }

      window.location.href = access.destination;`;

const patches = [
    {
        path: "login.html",
        search: loginFormAnchor,
        replace: loginFormReplacement
    },
    {
        path: "js/auth.js",
        search: authImportAnchor,
        replace: authImportReplacement
    },
    {
        path: "js/auth.js",
        search: authRoutingAnchor,
        replace: authRoutingReplacement
    }
];

const result = await transaction(patches);

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D55R11 — LOGIN-AS INTEGRATION REPAIR");
console.log("===============================================");
console.log(JSON.stringify(result, null, 2));
console.log("===============================================");

if (!result || result.success === false) {
    console.log(
        "RC406-D55R11 REPAIR FAILED — TRANSACTION ROLLED BACK"
    );
    process.exitCode = 1;
} else {
    console.log("RC406-D55R11 REPAIR COMPLETE");
}
