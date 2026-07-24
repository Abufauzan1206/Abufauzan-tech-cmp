export async function getCountries() {

  const response = await fetch("/data/countries/countries.json");

  if (!response.ok) {
    throw new Error("Unable to load countries.");
  }

  return await response.json();

}