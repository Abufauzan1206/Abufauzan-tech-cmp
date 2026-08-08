/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Financial Validation Framework
 *
 * File: sandboxContext.js
 * Version: 1.0.0
 *
 * Sandbox Runtime Context
 * =====================================================
 */

let sandboxContext = {

    repositories: {},

    counters: {},

    metadata: {}

};

export function initializeSandboxContext() {

    sandboxContext = {

        repositories: {},

        counters: {},

        metadata: {}

    };

    return sandboxContext;

}

export function getSandboxContext() {

    return sandboxContext;

}

export function setSandboxRepository(
    name,
    repository
) {

    sandboxContext.repositories[name] =
        repository;

}

export function getSandboxRepository(
    name
) {

    return sandboxContext.repositories[name];

}

export function setSandboxCounter(
    name,
    value
) {

    sandboxContext.counters[name] =
        value;

}

export function getSandboxCounter(
    name
) {

    return sandboxContext.counters[name] ?? 0;

}

export function resetSandboxContext() {

    return initializeSandboxContext();

}
