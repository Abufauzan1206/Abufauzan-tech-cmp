import { CMPRepositoryFactory }
from "../../../js/repositories/repositoryFactory.js";
import { CMPAdapterFactory }
from "../../../js/adapters/adapterFactory.js";

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH Cooperative Management Platform");
    console.log("D136 - HOMEPAGE CUSTOMIZATION ARCHITECTURE");
    console.log("=========================================");

    const cooperativeId = "CMP-NG-COOP-001";

    const repository =
        CMPRepositoryFactory.cooperativeHomepageConfig();

    if (!repository) {
        throw new Error(
            "Homepage configuration repository was not exposed by factory."
        );
    }

    const saved = await repository.saveForCooperative(
        cooperativeId,
        {
            title: "Test Cooperative Homepage",
            tagline: "Test Cooperative"
        }
    );

    if (!saved) {
        throw new Error(
            "Homepage configuration was not created."
        );
    }

    if (saved.cooperativeId !== cooperativeId) {
        throw new Error(
            "Stored cooperativeId does not match target cooperative."
        );
    }

    if (saved.id !== cooperativeId) {
        throw new Error(
            "Homepage configuration document identity is not cooperative-scoped."
        );
    }

    const loaded =
        await repository.getForCooperative(cooperativeId);

    if (!loaded) {
        throw new Error(
            "Homepage configuration could not be retrieved."
        );
    }

    if (loaded.id !== cooperativeId) {
        throw new Error(
            "Retrieved configuration identity is incorrect."
        );
    }

    let rejected = false;

    try {
        await repository.saveForCooperative("   ", {});
    } catch (error) {
        rejected = true;
    }

    if (!rejected) {
        throw new Error(
            "Blank cooperativeId was not rejected."
        );
    }

    console.log(
        "D136 HOMEPAGE CUSTOMIZATION ARCHITECTURE: PASS"
    );
}

run().catch((error) => {
    console.error(
        "D136 HOMEPAGE CUSTOMIZATION ARCHITECTURE: FAIL"
    );
    console.error(error);
    process.exitCode = 1;
});
