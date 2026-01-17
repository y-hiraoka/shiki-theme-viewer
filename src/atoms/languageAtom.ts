import { atom } from "jotai";
import { atomFamily } from "jotai-family";
import {
  bundledLanguages,
  type BundledLanguage,
  type LanguageRegistration,
} from "shiki";

/**
 * Atom family that loads and caches language objects.
 * Each language is loaded once via dynamic import and cached.
 * Note: Returns an array as some languages have multiple grammars.
 */
export const languageObjectAtomFamily = atomFamily((lang: BundledLanguage) =>
  atom(async (): Promise<LanguageRegistration[]> => {
    const mod = await bundledLanguages[lang]();
    return mod.default;
  })
);
