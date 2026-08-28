import { patch } from "../patchEngine.js";

const path = "js/auth.js";

const importSearch = `import { auth, db } from "./firebase-config.js";
import { rolesMatch } from "./components/roleAuthorization.js";
import { resolveAccess } from "./controllers/accessController.js";

import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";`;

const importReplace = `import { auth } from "./firebase-config.js";
import { resolveAccess } from "./controllers/accessController.js";

import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";`;

const profileSearch = `      const uid = userCredential.user.uid;

      const userDoc = await getDoc(doc(db, "users", uid));

      if (!userDoc.exists()) {
        alert("User profile not found.");
        return;
      }

      const userData = userDoc.data();

      alert("Login successful!");

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

      const access = await resolveAccess(loginAsRole);`;

const profileReplace = `      /*
       * Authentication is established by Firebase.
       * Profile and role authority belongs exclusively to
       * the Central Access Controller.
       */
      const loginAsRole =
          document.getElementById("loginAsRole")?.value || null;

      const access = await resolveAccess(loginAsRole);`;

const { readFile } = await import("node:fs/promises");
const source = await readFile(path, "utf8");

if (!source.includes(importSearch)) {
  throw new Error(
    "RC406-D55R21-AU import target contract invalid; refusing non-deterministic patch."
  );
}

if (!source.includes(profileSearch)) {
  throw new Error(
    "RC406-D55R21-AU profile target contract invalid; refusing non-deterministic patch."
  );
}

const importResult = await patch({
  path,
  mode: "exact",
  search: importSearch,
  replace: importReplace
});

const profileResult = await patch({
  path,
  mode: "exact",
  search: profileSearch,
  replace: profileReplace
});

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D55R21-AU — LOGIN AUTH CENTRAL PROFILE REPAIR");
console.log("===============================================");
console.log("IMPORT PATCH:", importResult);
console.log("PROFILE PATCH:", profileResult);
console.log("===============================================");
console.log("RC406-D55R21-AU REPAIR COMPLETE");
