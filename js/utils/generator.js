export function generateCMPId(country) {

  const countryCodes = {
    Nigeria: "NG",
    Ghana: "GH",
    Kenya: "KE",
    "South Africa": "ZA",
    "United Kingdom": "GB",
    "United States": "US",
    Canada: "CA",
    India: "IN"
  };

  const code = countryCodes[country] || "XX";

  return "CMP-" + code + "-" + Date.now();

}