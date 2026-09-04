import fs from "fs";

const servicePath =
    "js/services/cooperativeDiscoveryService.js";

const uiPath =
    "modules/membership-application/app.js";

const backendPath =
    "functions/index.js";

const service =
    fs.readFileSync(servicePath, "utf8");

const ui =
    fs.readFileSync(uiPath, "utf8");

const backend =
    fs.readFileSync(backendPath, "utf8");

let failed = false;

function pass(label) {
    console.log(`PASS: ${label}`);
}

function fail(label) {
    console.error(`FAIL: ${label}`);
    failed = true;
}

if (
    service.includes("httpsCallable") &&
    service.includes("getActiveCooperatives")
) {
    pass("discovery service uses callable boundary");
} else {
    fail("discovery service callable boundary missing");
}

if (
    service.includes("getActiveCooperativesCallable") &&
    service.includes("await getActiveCooperativesCallable()")
) {
    pass("discovery service delegates to callable");
} else {
    fail("discovery service callable delegation missing");
}

if (
    service.includes("result?.data?.success") &&
    service.includes("result.data.cooperatives")
) {
    pass("discovery service validates callable response");
} else {
    fail("discovery response validation missing");
}

if (
    ui.includes("getActiveCooperatives()") &&
    ui.includes("cooperativeSelect.appendChild(option)")
) {
    pass("membership UI populates cooperative selector from discovery service");
} else {
    fail("membership UI cooperative selector integration missing");
}

if (
    ui.includes("option.value = cooperative.cooperativeId.trim()") &&
    ui.includes("option.textContent = cooperative.cooperativeName.trim()")
) {
    pass("UI maps cooperative identity fields correctly");
} else {
    fail("UI cooperative identity mapping missing");
}

const exportMarker =
    "exports.getActiveCooperatives =";

const exportStart =
    backend.indexOf(exportMarker);

if (exportStart === -1) {
    fail("getActiveCooperatives backend export missing");
} else {
    pass("getActiveCooperatives backend export exists");

    const nextExport =
        backend.indexOf("\nexports.", exportStart + exportMarker.length);

    const block =
        backend.slice(
            exportStart,
            nextExport === -1 ? backend.length : nextExport
        );

    if (
        block.includes('status !== "active"') ||
        block.includes('status === "active"') ||
        block.includes('.where("status", "==", "active")')
    ) {
        pass("backend active cooperative status boundary present");
    } else {
        fail("backend active cooperative status boundary missing");
    }

    if (
        block.includes("cooperativeId") &&
        block.includes("cooperativeName")
    ) {
        pass("backend returns cooperative identity fields");
    } else {
        fail("backend cooperative identity response missing");
    }
}

if (
    !service.includes("getDocs") &&
    !service.includes("collection(") &&
    !service.includes("where(")
) {
    pass("discovery service has no direct Firestore query bypass");
} else {
    fail("discovery service contains direct Firestore query bypass");
}

if (failed) {
    console.error(
        "RC406-D100 PUBLIC MEMBERSHIP COOPERATIVE DISCOVERY CONTRACT AUDIT: FAIL"
    );
    process.exit(1);
}

console.log(
    "RC406-D100 PUBLIC MEMBERSHIP COOPERATIVE DISCOVERY CONTRACT AUDIT: PASS"
);
