import { atomWithLocation } from "jotai-location";

/**
 * Atom that syncs with window.location.
 * Uses replaceState to avoid polluting browser history on every change.
 */
export const locationAtom = atomWithLocation({ replace: true });
