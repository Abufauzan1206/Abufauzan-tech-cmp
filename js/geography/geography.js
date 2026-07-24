import { getCountries } from "./countries.js";

export async function loadCountries(selectId) {

  const countries = await getCountries();

  const select = document.getElementById(selectId);

  select.innerHTML =
    '<option value="">Select Country</option>';

  countries.forEach(country => {

    const option = document.createElement("option");

    option.value = country.name;

    option.textContent = country.name;

    select.appendChild(option);

  });

}