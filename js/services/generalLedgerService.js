/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Service Layer
 *
 * File: generalLedgerService.js
 * Version: 1.0.0
 *
 * General Ledger Business Service
 * =====================================================
 */

import {
    CMPRepositoryManager
} from "../repositories/repositoryManager.js";

const generalLedgerRepository =
    CMPRepositoryManager.get("generalLedger");

export async function getAllLedgerBatches(options = {}) {

    if (options.scope !== "cooperative") {
    return await generalLedgerRepository.findAll();
  }

  const { getAuthenticatedProfile } =
    await import("../controllers/accessController.js");
  const { rolesMatch } =
    await import("../components/roleAuthorization.js");

  const session = await getAuthenticatedProfile();
  const role = session?.profile?.role;

  if (!session || !rolesMatch(role, "cooperative_admin")) {
    throw new Error(
      "Cooperative report scope requires Cooperative Admin authentication."
    );
  }

  const cooperativeId = session.profile?.cooperativeId;

  if (!cooperativeId || typeof cooperativeId !== "string") {
    throw new Error(
      "Authenticated Cooperative Admin cooperativeId is required."
    );
  }

  return await generalLedgerRepository.findAllByCooperativeId(
    cooperativeId.trim()
  );

}
