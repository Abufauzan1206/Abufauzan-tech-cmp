const fs = require("fs");

const runnerPath =
  "tools/patchAssistant/rc/rc297DCooperativeApplicationServerBoundary.cjs";

let runner = fs.readFileSync(runnerPath, "utf8");

const start = runner.indexOf("const oldServicePattern =");
const end = runner.indexOf("const marker =", start);

if (start === -1 || end === -1) {
  console.error("FAIL: RC297D service matcher section could not be located.");
  process.exit(1);
}

const replacement = `
const normalize = (value) =>
  value.replace(/\\s+/g, " ").trim();

const serviceStart = service.indexOf(
  "export async function createCooperative(data)"
);

if (serviceStart === -1) {
  fail("createCooperative function was not found.");
}

const serviceEnd = service.indexOf(
  "\\n}",
  serviceStart
);

if (serviceEnd === -1) {
  fail("createCooperative function closing boundary was not found.");
}

const actualServiceBlock =
  service.slice(
    serviceStart,
    serviceEnd + 2
  );

const expectedServiceBlock = \`
export async function createCooperative(data) {
  const cooperativeId = generateCMPId(data.country);
  await setDoc(
    doc(db, "cooperatives", cooperativeId),
    {
      cooperativeId: cooperativeId,
      cooperativeName: data.coopName,
      registrationNumber: data.registrationNumber,
      cooperativeType: data.coopType,
      country: data.country,
      state: data.state,
      city: data.city,
      officeAddress: data.officeAddress,
      officialEmail: data.coopEmail,
      officialPhone: data.coopPhone,
      administratorName: data.adminName,
      administratorEmail: data.adminEmail,
      subscriptionPlan: data.subscriptionPlan,
      status: "pending",
      createdAt: serverTimestamp()
    }
  );
  return cooperativeId;
}\`;

if (normalize(actualServiceBlock) !== normalize(expectedServiceBlock)) {
  fail("Audited direct cooperative client write structure was not found.");
}

const newService = \`
import { getFunctions, httpsCallable } from
  "https://www.gstatic.com/firebasejs/12.0.0/firebase-functions.js";

const functions = getFunctions();

const submitCooperativeApplication = httpsCallable(
  functions,
  "submitCooperativeApplication"
);

export async function createCooperative(data) {
  const result =
    await submitCooperativeApplication(data);

  if (
    !result?.data?.success ||
    !result?.data?.cooperativeId
  ) {
    throw new Error(
      result?.data?.message ||
      "Unable to submit cooperative application."
    );
  }

  return result.data.cooperativeId;
}\`;

service =
  service.slice(0, serviceStart) +
  newService +
  service.slice(serviceEnd + 2);

`;

runner =
  runner.slice(0, start) +
  replacement +
  runner.slice(end);

fs.writeFileSync(runnerPath, runner);

console.log("RC297D SERVICE MATCHER REPAIR APPLIED");
console.log("PASS: direct cooperative write matcher is now whitespace-tolerant");
console.log("PASS: replacement remains guarded by structural comparison");
console.log("PASS: no Firebase target modified by this repair");
