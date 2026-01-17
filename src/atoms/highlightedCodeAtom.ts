import { atomFamily } from "jotai-family";
import { eagerAtom } from "jotai-eager";
import type { BundledTheme } from "shiki";
import { highlighterAtom } from "./highlighterAtom";
import { themeObjectAtomFamily } from "./themeAtom";
import { languageObjectAtomFamily } from "./languageAtom";
import { codeAtom } from "./codeAtom";
import { languageAtom } from "./searchParamsAtom";

/**
 * Atom family that returns highlighted HTML for a given theme.
 * Uses atomFamily for memoization - same theme always returns same atom.
 * Uses eagerAtom to minimize Suspense - only suspends when resources not loaded.
 */
export const highlightedCodeAtomFamily = atomFamily((theme: BundledTheme) =>
  eagerAtom((get) => {
    const highlighter = get(highlighterAtom);
    const code = get(codeAtom);
    const lang = get(languageAtom);

    // Get theme/language objects (suspends if not loaded yet)
    const themeObj = get(themeObjectAtomFamily(theme));
    const langObj = get(languageObjectAtomFamily(lang));

    // Load theme and language synchronously (idempotent - safe to call multiple times)
    highlighter.loadThemeSync(themeObj);
    highlighter.loadLanguageSync(langObj);

    return highlighter.codeToHtml(code, { theme, lang });
  })
);
