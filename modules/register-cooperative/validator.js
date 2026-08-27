export function validateForm(data) {

  if (data.coopName === "") {
    alert("Please enter the Cooperative Name.");
    return false;
  }

  if (data.adminEmail === "") {
    alert("Please enter the Administrator Email.");
    return false;
  }

  return true;

}