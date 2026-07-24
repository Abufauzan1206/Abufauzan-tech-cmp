import { auth } from "./firebase-config.js";

import { buildSidebar } from "./navigation/sidebar.js";

import {
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {

  if (!user) {
    window.location.href = "login.html";
  }
  
  buildSidebar("sidebarMenu");

});

document.getElementById("logoutBtn").addEventListener("click", async () => {

  await signOut(auth);

  alert("Logged out successfully.");

  window.location.href = "login.html";

});