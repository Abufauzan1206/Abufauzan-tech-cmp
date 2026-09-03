import fs from "fs";

const source = fs.readFileSync(
  "functions/index.js",
  "utf8"
);

const approveStart =
  source.indexOf(
    "exports.approveMembershipApplication = onCall"
  );

const rejectStart =
  source.indexOf(
    "exports.rejectMembershipApplication = onCall"
  );

const submitStart =
  source.indexOf(
    "exports.submitMembershipApplication = onCall"
  );

const approveBlock =
  approveStart >= 0 && rejectStart > approveStart
    ? source.slice(approveStart, rejectStart)
    : "";

const rejectBlock =
  rejectStart >= 0 && submitStart > rejectStart
    ? source.slice(rejectStart, submitStart)
    : "";

const contextStart =
  source.indexOf(
    "async function getCooperativeAdminDecisionContext"
  );

const contextBlock =
  contextStart >= 0 && approveStart > contextStart
    ? source.slice(contextStart, approveStart)
    : "";

const checks = [];

function check(name, condition) {
  checks.push({
    name,
    status: condition ? "PASS" : "FAIL"
  });
}

check(
  "APPROVAL_CALLABLE_EXISTS",
  approveStart >= 0
);

check(
  "REJECTION_CALLABLE_EXISTS",
  rejectStart >= 0
);

check(
  "ORIGINAL_SUBMISSION_REMAINS",
  submitStart >= 0
);

check(
  "AUTHENTICATION_REQUIRED",
  contextBlock.includes("if (!request.auth)")
);

check(
  "CALLER_UID_READ",
  contextBlock.includes("request.auth.uid")
);

check(
  "USER_PROFILE_LOOKUP",
  contextBlock.includes('collection("users")')
);

check(
  "COOPERATIVE_ADMIN_ROLE_REQUIRED",
  contextBlock.includes(
    'userData.role !== "cooperative_admin"'
  )
);

check(
  "COOPERATIVE_ID_DERIVED_FROM_PROFILE",
  contextBlock.includes("userData.cooperativeId")
);

check(
  "APPLICATION_ID_READ",
  approveBlock.includes("normalizeApplicationId")
);

check(
  "APPROVAL_APPLICATION_LOOKUP",
  approveBlock.includes(
    'collection("membershipApplications")'
  )
);

check(
  "REJECTION_APPLICATION_LOOKUP",
  rejectBlock.includes(
    'collection("membershipApplications")'
  )
);

check(
  "APPROVAL_COOPERATIVE_SCOPE_CHECK",
  approveBlock.includes(
    "application.cooperativeId !== cooperativeId"
  )
);

check(
  "REJECTION_COOPERATIVE_SCOPE_CHECK",
  rejectBlock.includes(
    "application.cooperativeId !== cooperativeId"
  )
);

check(
  "APPROVAL_PENDING_REQUIRED",
  approveBlock.includes(
    'application.status !== "pending"'
  )
);

check(
  "REJECTION_PENDING_REQUIRED",
  rejectBlock.includes(
    'application.status !== "pending"'
  )
);

check(
  "MEMBER_COLLECTION_USED",
  approveBlock.includes(
    'collection("members")'
  )
);

check(
  "MEMBER_ID_GENERATION_PRESENT",
  approveBlock.includes("generateMemberId()")
);

check(
  "MEMBER_ID_CONTRACT_PRESENT",
  source.includes("ATC-MEM-")
);

check(
  "MEMBER_STATUS_ACTIVE",
  approveBlock.includes('status: "active"')
);

check(
  "MEMBER_COOPERATIVE_ID_PERSISTED",
  approveBlock.includes("cooperativeId,")
);

check(
  "MEMBER_IDENTITY_FIELDS_PERSISTED",
  approveBlock.includes("firstName") &&
  approveBlock.includes("lastName") &&
  approveBlock.includes("phone")
);

check(
  "MEMBER_CREATED_AT_PERSISTED",
  approveBlock.includes(
    "createdAt: FieldValue.serverTimestamp()"
  )
);

check(
  "APPLICATION_APPROVED",
  approveBlock.includes('status: "approved"')
);

check(
  "APPROVAL_MEMBER_ID_LINKED",
  approveBlock.includes("memberId,")
);

check(
  "APPROVAL_ATOMIC_TRANSACTION",
  approveBlock.includes(
    "db.runTransaction"
  )
);

check(
  "APPROVAL_TRANSACTION_CREATES_MEMBER",
  approveBlock.includes(
    "transaction.create(memberRef, memberData)"
  )
);

check(
  "APPROVAL_TRANSACTION_UPDATES_APPLICATION",
  approveBlock.includes(
    "transaction.update(applicationRef"
  )
);

check(
  "REJECTION_ATOMIC_TRANSACTION",
  rejectBlock.includes(
    "db.runTransaction"
  )
);

check(
  "REJECTION_UPDATES_APPLICATION",
  rejectBlock.includes(
    "transaction.update(applicationRef"
  )
);

check(
  "REJECTION_STATUS_REJECTED",
  rejectBlock.includes('status: "rejected"')
);

check(
  "REJECTION_DOES_NOT_CREATE_MEMBER",
  !rejectBlock.includes(
    "collection(\"members\")"
  ) &&
  !rejectBlock.includes(
    "transaction.create(memberRef"
  )
);

check(
  "APPROVAL_DOES_NOT_USE_MEMBER_ENGINE",
  !approveBlock.includes(
    "CMPMemberEngine"
  )
);

check(
  "REJECTION_DOES_NOT_USE_MEMBER_ENGINE",
  !rejectBlock.includes(
    "CMPMemberEngine"
  )
);

check(
  "NO_CLIENT_COOPERATIVE_AUTHORITY",
  !contextBlock.includes(
    "request.data.cooperativeId"
  )
);

check(
  "NO_PUBLIC_APPROVAL_PATH",
  !approveBlock.includes(
    "request.data.role"
  )
);

check(
  "SUCCESS_RESPONSE_APPROVAL",
  approveBlock.includes(
    'success: true'
  ) &&
  approveBlock.includes(
    'status: "approved"'
  )
);

check(
  "SUCCESS_RESPONSE_REJECTION",
  rejectBlock.includes(
    'success: true'
  ) &&
  rejectBlock.includes(
    'status: "rejected"'
  )
);

const failed = checks.filter(
  (item) => item.status === "FAIL"
);

for (const item of checks) {
  console.log(
    `${item.name}: ${item.status}`
  );
}

console.log(
  failed.length === 0
    ? "RC406-D69 MEMBERSHIP APPLICATION DECISION AUDIT: PASS"
    : "RC406-D69 MEMBERSHIP APPLICATION DECISION AUDIT: FAIL"
);

if (failed.length > 0) {
  process.exitCode = 1;
}
