import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "login.html",
        search: `<input
type="password"
id="password"
placeholder="🔒 Password"
required>
<br><br>
<button
type="submit"
class="btn-primary">`,
        replace: `<input
type="password"
id="password"
placeholder="🔒 Password"
required>
<br><br>
<div class="login-as-group">
<label for="loginAs">Login As</label>
<select id="loginAs" required>
<option value="">Select access category</option>
<option value="cooperative_admin">Cooperative Admin</option>
<option value="member">Member</option>
</select>
</div>
<br>
<button
type="submit"
class="btn-primary">`
    },
    {
        path: "js/auth.js",
        search: `import { auth, db } from "./firebase-config.js";
import { rolesMatch } from "./components/roleAuthorization.js";`,
        replace: `import { auth, db } from "./firebase-config.js";
import { resolveAccess } from "./controllers/accessController.js";`
    },
    {
        path: "js/auth.js",
        search: `      const userData = userDoc.data();
      alert("Login successful!");
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
        }`,
        replace: `      const userData = userDoc.data();

      const loginAsElement = document.getElementById("loginAs");
      const requestedRole = loginAsElement?.value?.trim() || null;

      const access = await resolveAccess(requestedRole);

      if (!access.allowed) {
        if (access.reason === "LOGIN_AS_ROLE_MISMATCH") {
          alert(
            "The selected Login-as category does not match your authenticated role."
          );
        } else if (
          access.reason === "LOGIN_AS_SELECTION_REQUIRED"
        ) {
          alert("Please select a Login-as category.");
        } else if (
          access.reason === "NO_DASHBOARD_ROUTE"
        ) {
          alert("No dashboard is configured for your authenticated role.");
        } else {
          alert(
            "Access denied: " +
            (access.reason || "Unauthorized access.")
          );
        }
        return;
      }

      window.location.href = access.destination;`
    },
    {
        path: "css/style.css",
        search: `.login-card input:focus{
outline:none;
border-color:#334155;
box-shadow:0 0 0 3px rgba(51,65,85,.15);
}`,
        replace: `.login-card input:focus{
outline:none;
border-color:#334155;
box-shadow:0 0 0 3px rgba(51,65,85,.15);
}

.login-as-group{
text-align:left;
margin-bottom:5px;
}

.login-as-group label{
display:block;
margin-bottom:6px;
font-weight:bold;
color:#334155;
}

.login-as-group select{
width:100%;
padding:14px;
font-size:16px;
border:1px solid #CBD5E1;
border-radius:10px;
background:#ffffff;
color:#334155;
box-sizing:border-box;
}

.login-as-group select:focus{
outline:none;
border-color:#334155;
box-shadow:0 0 0 3px rgba(51,65,85,.15);
}`
    }
];

const result = await transaction(patches);

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D55 — LOGIN-AS INTEGRATION PATCH");
console.log("===============================================");
console.log(JSON.stringify(result, null, 2));
console.log("===============================================");

if (!result || result.success === false) {
    process.exitCode = 1;
}
