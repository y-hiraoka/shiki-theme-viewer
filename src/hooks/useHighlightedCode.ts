import type { BundledLanguage, BundledTheme } from "shiki";
import {
  isThemeLoaded,
  isLanguageLoaded,
  loadTheme,
  loadLanguage,
  highlightCodeSync,
  initializeHighlighter,
} from "../lib/shiki/highlighter";

// Cached load promises for Suspense (keyed by theme:lang)
const resourceLoadPromises = new Map<string, Promise<void>>();

/**
 * Ensures theme and language are loaded.
 * Throws a promise if resources need to be loaded (triggers Suspense).
 * Returns immediately if resources are already loaded.
 */
function ensureResourcesLoaded(
  theme: BundledTheme,
  lang: BundledLanguage
): void {
  // If already loaded, return immediately (no suspend)
  if (isThemeLoaded(theme) && isLanguageLoaded(lang)) {
    return;
  }

  const key = `${theme}:${lang}`;

  // Create or get cached promise
  if (!resourceLoadPromises.has(key)) {
    const promise = (async () => {
      await initializeHighlighter();
      await Promise.all([loadTheme(theme), loadLanguage(lang)]);
    })();
    resourceLoadPromises.set(key, promise);
  }

  // Throw promise to trigger Suspense
  throw resourceLoadPromises.get(key);
}

/**
 * Hook that returns highlighted HTML for the given code.
 *
 * - Suspends if theme/language needs to be loaded (async)
 * - Returns highlighted HTML synchronously if resources are loaded
 *
 * This ensures code editing doesn't trigger Suspense since
 * theme/language are already loaded.
 *
 * @param code - The code to highlight
 * @param theme - The Shiki theme to use
 * @param lang - The language for syntax highlighting
 * @returns The highlighted HTML string
 */
export function useHighlightedCode(
  code: string,
  theme: BundledTheme,
  lang: BundledLanguage
): string {
  // This will suspend if resources are not loaded
  ensureResourcesLoaded(theme, lang);

  // Resources are loaded, highlight synchronously
  return highlightCodeSync(code, theme, lang);
}
