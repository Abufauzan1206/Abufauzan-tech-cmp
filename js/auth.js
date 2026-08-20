import { auth, db } from "./firebase-config.js";
import { rolesMatch } from "./components/roleAuthorization.js";

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

      if (
            rolesMatch(userData.role, "super_admin")
        ) {
            window.location.href = "super-admin.html";
        } else if (
            rolesMatch(userData.role, "cooperative_admin")
        ) {
            window.location.href = "cooperative-admin.html";
        } else {

        alert("Dashboard for " + userData.role + " is not yet available.");

      }

    } catch (error) {

      alert(error.message);

    }

  });

}