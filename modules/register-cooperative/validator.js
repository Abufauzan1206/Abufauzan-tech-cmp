export function validateForm(data) {

  if (data.coopName === "") {
    alert("Please enter the Cooperative Name.");
    return false;
  }

  if (data.adminEmail === "") {
    alert("Please enter the Administrator Email.");
    return false;
  }

  if (data.adminPassword === "") {
    alert("Please enter a Temporary Password.");
    return false;
  }

  if (data.adminPassword.length < 6) {
    alert("Password must be at least 6 characters.");
    return false;
  }

  return true;

}