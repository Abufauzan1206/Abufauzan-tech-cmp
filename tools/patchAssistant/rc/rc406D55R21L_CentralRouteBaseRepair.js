import { transaction } from "../patchEngine.js";

const oldBlock = `const DASHBOARD_ROUTES = Object.freeze({
    cooperative_admin: "cooperative-admin.html",
    member: "modules/member-portal/index.html"
});`;

const newBlock = `const APP_BASE_URL = new URL(
    "../../",
    import.meta.url
);

const DASHBOARD_ROUTES = Object.freeze({
    cooperative_admin: "cooperative-admin.html",
    member: "modules/member-portal/index.html"
});

function resolveAppRoute(destination) {
    return new URL(
        destination,
        APP_BASE_URL
    ).href;
}`;

const oldEnforce = `export async function enforceDashboardAccess(requestedRole = null) {
    const result = await resolveAccess(requestedRole);

    if (!result.allowed) {
        if (result.reason === "AUTHENTICATION_REQUIRED") {
            window.location.href = "login.html";
        }

        return result;
    }

    const currentPage = window.location.pathname;

    if (
        result.destination &&
        !currentPage.endsWith(result.destination)
    ) {
        window.location.href = result.destination;
    }

    return result;
}`;

const newEnforce = `export async function enforceDashboardAccess(requestedRole = null) {
    const result = await resolveAccess(requestedRole);

    if (!result.allowed) {
        if (result.reason === "AUTHENTICATION_REQUIRED") {
            window.location.href =
                resolveAppRoute("login.html");
        }

        return result;
    }

    const destinationUrl = result.destination
        ? new URL(
            result.destination,
            APP_BASE_URL
        )
        : null;

    const currentUrl = new URL(
        window.location.href
    );

    if (
        destinationUrl &&
        currentUrl.pathname !== destinationUrl.pathname
    ) {
        window.location.href =
            destinationUrl.href;
    }

    return result;
}`;

const patches = [
    {
        path: "js/controllers/accessController.js",
        search: oldBlock,
        replace: newBlock
    },
    {
        path: "js/controllers/accessController.js",
        search: oldEnforce,
        replace: newEnforce
    }
];

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D55R21-L — CENTRAL ROUTE BASE REPAIR");
console.log("===============================================");

const result = await transaction(patches);

console.log(result);

console.log("===============================================");

if (!result || result.success === false) {
    console.log(
        "RC406-D55R21-L REPAIR FAILED — TRANSACTION ROLLED BACK"
    );
    process.exitCode = 1;
} else {
    console.log(
        "RC406-D55R21-L REPAIR COMPLETE"
    );
}
