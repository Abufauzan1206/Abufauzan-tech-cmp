import { auth, db } from "./firebase-config.js";
import { rolesMatch } from "./components/roleAuthorization.js";
import { resolveAccess } from "./controllers/accessController.js";

import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const loginForm = document.getElementById("loginForm");

if (loginForm) {

  loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {

      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      const uid = userCredential.user.uid;

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

      const access = await resolveAccess(loginAsRole);

      if (!access.allowed) {
          alert(access.reason);
          return;
      }

      window.location.href = access.destination;

    } catch (error) {

      alert(error.message);

    }

  });

}