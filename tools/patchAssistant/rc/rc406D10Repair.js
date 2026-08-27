import { patch } from "../patchEngine.js";

const result = await patch({
    path: "tools/patchAssistant/rc/rc406DrawGroupOwnershipPatch.js",

    search: `        search: \`    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";\`,`,

    replace: `        search: \`    updateDoc,
    serverTimestamp
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";\`,`
});

console.log("===============================================");
console.log("RC406-D10-R1 PATCH 2 CONTRACT REPAIR");
console.log("===============================================");
console.log(JSON.stringify(result, null, 2));

if (!result.success) {
    process.exitCode = 1;
}

console.log("===============================================");
