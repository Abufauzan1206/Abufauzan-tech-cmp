import { buildSidebar } from "./navigation/sidebar.js";

// Build the sidebar
buildSidebar("sidebarMenu");

// Register button loader (only if the button exists)
const registerBtn = document.getElementById("registerBtn");

if (registerBtn) {
  registerBtn.addEventListener("click", loadRegisterModule);
}

async function loadRegisterModule() {

  const response = await fetch(
    "modules/register-cooperative/index.html"
  );

  const html = await response.text();

  document.getElementById("content").innerHTML = html;

  await import("../modules/register-cooperative/script.js");

}