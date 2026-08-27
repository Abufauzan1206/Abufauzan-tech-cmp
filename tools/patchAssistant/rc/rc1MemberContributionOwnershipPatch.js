import { transaction } from "../patchEngine.js";

const patches = [

    {
        path: "js/business/memberValidationService.js",

        mode: "regex",

        search: String.raw`(\s*if\s*\(!member\.phone\?\.trim\(\)\)\s*\{\s*throw new Error\(\s*"Phone number is required\."\s*\);\s*\})\s*return true;`,

        replace: `$1

        /*
         * RC1 OWNERSHIP CONTRACT
         *
         * Every cooperative member must belong to a
         * cooperative before reaching the repository boundary.
         */
        if (!member.cooperativeId?.trim()) {
            throw new Error(
                "Member cooperative ownership is required."
            );
        }

        return true;`
    },

    {
        path: "js/business/contributionEngine.js",

        mode: "regex",

        search: String.raw`static create\(contribution\)\s*\{\s*const newContribution = \{\s*contributionId:\s*CMPIdService\.generate\("CON"\),\s*createdAt:\s*new Date\(\),\s*status:\s*"pending",\s*\.\.\.contribution\s*\};\s*CMPRepositoryManager\s*\.contribution\s*\.create\(newContribution\);\s*return newContribution;\s*\}`,

        replace: `static create(contribution) {

        if (!contribution?.memberId) {
            throw new Error(
                "Contribution member ownership is required."
            );
        }

        if (!contribution?.cooperativeId) {
            throw new Error(
                "Contribution cooperative ownership is required."
            );
        }

        const newContribution = {
            contributionId:
                CMPIdService.generate("CON"),
            createdAt:
                new Date(),
            status:
                "pending",
            ...contribution
        };

        CMPRepositoryManager
            .contribution
            .create(newContribution);

        return newContribution;
    }`
    }

];

console.log("================================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC1 — MEMBER + CONTRIBUTION OWNERSHIP PATCH");
console.log("================================================");
console.log("PATCH COUNT:", patches.length);
console.log("");

try {
    const result = await transaction(patches);

    console.log("PATCH RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;
    }

    console.log(
        result.success
            ? "RC1 MEMBER + CONTRIBUTION OWNERSHIP PATCH: PASS"
            : "RC1 MEMBER + CONTRIBUTION OWNERSHIP PATCH: FAIL"
    );

} catch (error) {
    console.error("PATCH FAILED:");
    console.error(error);
    process.exitCode = 1;
}

console.log("================================================");
