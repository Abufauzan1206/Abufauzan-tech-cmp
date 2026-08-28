import fs from "fs";
import { patch } from "../patchEngine.js";

const path = "js/auth.js";
const source = fs.readFileSync(path, "utf8");

const search = `import { auth } from "./firebase-config.js";
import { resolveAccess } from "./controllers/accessController.js";`;

const replace = `import { auth } from "./firebase-config.js";
import { enforceDashboardAccess } from "./controllers/accessController.js";`;

if (!source.includes(search)) {
    throw new Error(
        "BD-1 target import contract not found; refusing non-deterministic patch."
    );
}

let result = await patch({
    path,
    mode: "exact",
    search,
    replace
});

if (!result.success) {
    throw new Error("BD-1 import repair failed.");
}

const searchFlow = `      const access = await resolveAccess(loginAsRole);

      if (!access.allowed) {
          alert(access.reason);
          return;
      }

      window.location.href = access.destination;`;

const replaceFlow = `      const access = await enforceDashboardAccess(loginAsRole);

      if (!access.allowed) {
          await auth.signOut();
          alert(access.reason);
          return;
      }

      return;`;

const updated = fs.readFileSync(path, "utf8");

if (!updated.includes(searchFlow)) {
    throw new Error(
        "BD-2 target login routing flow not found; refusing non-deterministic patch."
    );
}

result = await patch({
    path,
    mode: "exact",
    search: searchFlow,
    replace: replaceFlow
});

if (!result.success) {
    throw new Error("BD-2 central ownership repair failed.");
}

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D55R21-BD — LOGIN POST-AUTH CENTRAL OWNERSHIP REPAIR");
console.log("===============================================");
console.log("BD-1: Central controller import repaired.");
console.log("BD-2: Successful routing delegated to enforceDashboardAccess.");
console.log("BD-3: Rejected authenticated access now signs out.");
console.log("===============================================");
console.log("RC406-D55R21-BD REPAIR COMPLETE");
