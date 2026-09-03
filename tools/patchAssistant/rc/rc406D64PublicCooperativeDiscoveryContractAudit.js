import fs from "fs";

const appPath = "modules/membership-application/app.js";
const servicePath = "js/services/cooperativeDiscoveryService.js";

const app = fs.readFileSync(appPath, "utf8");
const service = fs.readFileSync(servicePath, "utf8");

const checks = [
    [
        "DISCOVERY_SERVICE_EXISTS",
        fs.existsSync(servicePath)
    ],
    [
        "DISCOVERY_SERVICE_EXPORTS_GET_ACTIVE_COOPERATIVES",
        /export\s+async\s+function\s+getActiveCooperatives\s*\(/.test(service)
    ],
    [
        "DISCOVERY_SERVICE_USES_CALLABLE",
        /httpsCallable\s*\(/.test(service)
    ],
    [
        "DISCOVERY_CALLABLE_NAME_CORRECT",
        /"getActiveCooperatives"/.test(service)
    ],
    [
        "DISCOVERY_SERVICE_NO_DIRECT_FIRESTORE",
        !/from\s+["'][^"']*firebase-firestore[^"']*["']/.test(service) &&
        !/\b(collection|query|getDocs|where)\s*\(/.test(service)
    ],
    [
        "APP_IMPORTS_DISCOVERY_SERVICE",
        /import\s*\{\s*getActiveCooperatives\s*\}\s*from\s*["']\.\.\/\.\.\/js\/services\/cooperativeDiscoveryService\.js["'];/.test(app)
    ],
    [
        "COOPERATIVE_SELECT_BOUNDARY_EXISTS",
        /const\s+cooperativeSelect\s*=\s*document\.getElementById\s*\(\s*["']cooperativeId["']\s*\)/.test(app)
    ],
    [
        "LOAD_ACTIVE_COOPERATIVES_EXISTS",
        /async\s+function\s+loadActiveCooperatives\s*\(/.test(app)
    ],
    [
        "LOAD_ACTIVE_COOPERATIVES_CALLS_SERVICE",
        /await\s+getActiveCooperatives\s*\(\s*\)/.test(app)
    ],
    [
        "COOPERATIVE_OPTIONS_POPULATED",
        /createElement\s*\(\s*["']option["']\s*\)/.test(app) &&
        /cooperativeId/.test(app) &&
        /cooperativeName/.test(app)
    ],
    [
        "DISCOVERY_LOADER_INVOKED",
        /loadActiveCooperatives\s*\(\s*\)\s*;/.test(app)
    ],
    [
        "NO_DIRECT_FIRESTORE_IN_PUBLIC_APP",
        !/firebase-firestore/.test(app) &&
        !/\b(getDocs|collection|query|where)\s*\(/.test(app)
    ],
    [
        "NO_D63_PLACEHOLDER_REMAINS",
        !/Cooperative discovery is intentionally NOT performed/.test(app)
    ]
];

let failed = false;

for (const [name, passed] of checks) {
    console.log(`${name}: ${passed ? "PASS" : "FAIL"}`);
    if (!passed) failed = true;
}

if (failed) {
    process.exitCode = 1;
    throw new Error(
        "RC406-D64 PUBLIC COOPERATIVE DISCOVERY CONTRACT AUDIT: FAIL"
    );
}

console.log(
    "RC406-D64 PUBLIC COOPERATIVE DISCOVERY CONTRACT AUDIT: PASS"
);
