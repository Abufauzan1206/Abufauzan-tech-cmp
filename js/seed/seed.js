import { seedCountry } from "./locations.js";

async function runSeed() {

  await seedCountry({

    code: "NG",

    name: "Nigeria"

  });

  alert("Countries seeded successfully.");

}

runSeed();