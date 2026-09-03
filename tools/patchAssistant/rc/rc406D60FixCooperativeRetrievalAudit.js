import fs from "fs";

const auditPath =
    "tools/patchAssistant/rc/rc406D60MembershipApplicationCooperativeRetrievalAudit.js";

let source =
    fs.readFileSync(auditPath, "utf8");

const oldCheck = `adapter.includes(
        'where("cooperativeId", "==", normalizedCooperativeId)'
    )`;

const newCheck = `adapter
    .replace(/\\\\s+/g, " ")
    .includes(
        'where( "cooperativeId", "==", normalizedCooperativeId )'
    )`;

if (!source.includes(oldCheck)) {
    console.log(
        "RC406-D60 AUDIT FIX: Search text not found."
    );
    process.exitCode = 1;
} else {
    source = source.replace(
        oldCheck,
        newCheck
    );

    fs.writeFileSync(
        auditPath,
        source,
        "utf8"
    );

    console.log(
        "RC406-D60 AUDIT FIX: PASS"
    );
}
