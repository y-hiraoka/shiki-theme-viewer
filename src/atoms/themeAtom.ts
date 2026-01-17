import { atom } from "jotai";
import { atomFamily } from "jotai-family";
import {
  bundledThemes,
  type BundledTheme,
  type ThemeRegistration,
} from "shiki";

/**
 * Atom family that loads and caches theme objects.
 * Each theme is loaded once via dynamic import and cached.
 */
export const themeObjectAtomFamily = atomFamily((theme: BundledTheme) =>
  atom(async (): Promise<ThemeRegistration> => {
    const mod = await bundledThemes[theme]();
    return mod.default;
  })
);
