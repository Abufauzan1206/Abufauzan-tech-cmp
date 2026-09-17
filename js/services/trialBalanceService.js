/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Service Layer
 *
 * File: trialBalanceService.js
 * Version: 1.0.0
 *
 * Trial Balance Business Service
 * =====================================================
 */

import {
    CMPRepositoryManager
} from "../repositories/repositoryManager.js";


const trialBalanceRepository =
    CMPRepositoryManager.get("ledgerBatch");


export async function getAllLedgerBatches(options = {}) {

    if (options.scope !== "cooperative") {
    return await trialBalanceRepository.findAll();
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

  return await trialBalanceRepository.findAllByCooperativeId(
    cooperativeId.trim()
  );

}
