"use client";

import { useSyncExternalStore } from "react";

/**
 * Empty subscribe function as we don't need to listen to external updates.
 * We only care about the initial mount state.
 */
const emptySubscribe = () => () => {};

/**
 * Custom hook to detect if the component has hydrated (mounted on the client).
 * Replaces the traditional useEffect approach to avoid linting warnings about cascading renders.
 * @returns {boolean} true if mounted on client, false if on server
 */
export function useHydration() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,     // Client snapshot: Always return true
    () => false     // Server snapshot: Always return false
  );
}