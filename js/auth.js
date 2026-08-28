import { auth } from "./firebase-config.js";
import { enforceDashboardAccess } from "./controllers/accessController.js";

import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const loginForm = document.getElementById("loginForm");

if (loginForm) {

  loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {

      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      /*
       * Authentication is established by Firebase.
       * Profile and role authority belongs exclusively to
       * the Central Access Controller.
       */
      const loginAsRole =
          document.getElementById("loginAsRole")?.value || null;

      const access = await enforceDashboardAccess(loginAsRole);

      if (!access.allowed) {
          await auth.signOut();
          alert(access.reason);
          return;
      }

      return;

    } catch (error) {

      alert(error.message);

    }

  });

}