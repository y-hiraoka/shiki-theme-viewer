import { atom } from "jotai";
import { selectAtom } from "jotai/utils";
import { eagerAtom } from "jotai-eager";
import { atomEffect } from "jotai-effect";
import { locationAtom } from "./locationAtom";
import { decompressCode, compressCode } from "../lib/compression/code-codec";
import { DEFAULT_CODE } from "../constants/defaults";

/**
 * Atom that extracts only the 'code' search param from location.
 * Uses selectAtom to avoid re-computation when other params change.
 */
const compressedCodeParamAtom = selectAtom(
  locationAtom,
  (location) => location.searchParams?.get("code") ?? null
);

/**
 * Atom that decompresses code from URL.
 * Returns DEFAULT_CODE if no code in URL or decompression fails.
 */
const codeFromUrlAtom = atom((get) => {
  const compressed = get(compressedCodeParamAtom);

  if (!compressed) {
    return DEFAULT_CODE;
  }

  return decompressCode(compressed).catch(() => {
    console.warn("Failed to decompress code from URL, using default");
    return DEFAULT_CODE;
  });
});

/**
 * Internal primitive atom for user-edited code.
 * null means the user hasn't edited yet (use codeFromUrlAtom instead).
 */
const internalCodeAtom = atom<string | null>(null);

/**
 * Main code atom with read/write capability.
 * Read: Returns code from codeReadAtom
 * Write: Updates internalCodeAtom
 */
export const codeAtom = eagerAtom(
  (get) => {
    const internalCode = get(internalCodeAtom);

    if (internalCode !== null) {
      return internalCode;
    }

    return get(codeFromUrlAtom);
  },
  (_get, set, newCode: string) => {
    set(internalCodeAtom, newCode);
  },
);

/**
 * Effect that syncs code changes to URL with 500ms debounce.
 * Only runs after user has edited code (internalCodeAtom is not null).
 */
export const syncCodeToUrlEffectAtom = atomEffect((get, set) => {
  const internalCode = get(internalCodeAtom);

  // Only sync if user has edited
  if (internalCode === null) return;

  const code = internalCode;

  // Debounce: wait 500ms before compressing and updating URL
  const timeoutId = setTimeout(async () => {
    try {
      const compressed = await compressCode(code);
      const location = get.peek(locationAtom);
      const params = new URLSearchParams(location.searchParams ?? undefined);
      params.set("code", compressed);
      set(locationAtom, { ...location, searchParams: params });
    } catch (error) {
      console.warn("Failed to compress code:", error);
    }
  }, 500);

  // Cleanup: cancel previous timeout on next code change
  return () => clearTimeout(timeoutId);
});
