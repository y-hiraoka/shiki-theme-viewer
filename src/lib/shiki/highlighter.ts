import type { BundledLanguage, BundledTheme, Highlighter } from "shiki";

// Singleton state
let highlighterPromise: Promise<Highlighter> | null = null;
let highlighterInstance: Highlighter | null = null;

/**
 * Gets the highlighter instance synchronously.
 * Returns null if not yet initialized.
 */
export function getHighlighterSync(): Highlighter | null {
  return highlighterInstance;
}

/**
 * Initializes the Shiki highlighter (async, call once).
 * Returns the same instance if already initialized.
 */
export async function initializeHighlighter(): Promise<Highlighter> {
  if (highlighterInstance) return highlighterInstance;

  if (!highlighterPromise) {
    highlighterPromise = import("shiki").then(async ({ createHighlighter }) => {
      highlighterInstance = await createHighlighter({ themes: [], langs: [] });
      return highlighterInstance;
    });
  }

  return highlighterPromise;
}

// Track loaded themes and languages
const loadedThemes = new Set<string>();
const loadedLanguages = new Set<string>();

/**
 * Checks if a theme is already loaded.
 */
export function isThemeLoaded(theme: BundledTheme): boolean {
  return loadedThemes.has(theme);
}

/**
 * Checks if a language is already loaded.
 */
export function isLanguageLoaded(lang: BundledLanguage): boolean {
  return loadedLanguages.has(lang);
}

// Cache for theme load promises (for deduplication)
const themeLoadPromises = new Map<string, Promise<void>>();

/**
 * Loads a theme into the highlighter.
 * Returns a cached promise if already loading.
 */
export function loadTheme(theme: BundledTheme): Promise<void> {
  if (loadedThemes.has(theme)) return Promise.resolve();

  if (!themeLoadPromises.has(theme)) {
    const promise = (async () => {
      const hl = await initializeHighlighter();
      await hl.loadTheme(theme);
      loadedThemes.add(theme);
    })();
    themeLoadPromises.set(theme, promise);
  }

  return themeLoadPromises.get(theme)!;
}

// Cache for language load promises (for deduplication)
const langLoadPromises = new Map<string, Promise<void>>();

/**
 * Loads a language into the highlighter.
 * Returns a cached promise if already loading.
 */
export function loadLanguage(lang: BundledLanguage): Promise<void> {
  if (loadedLanguages.has(lang)) return Promise.resolve();

  if (!langLoadPromises.has(lang)) {
    const promise = (async () => {
      const hl = await initializeHighlighter();
      await hl.loadLanguage(lang);
      loadedLanguages.add(lang);
    })();
    langLoadPromises.set(lang, promise);
  }

  return langLoadPromises.get(lang)!;
}

/**
 * Highlights code synchronously.
 * Requires highlighter to be initialized and theme/language to be loaded.
 * @throws Error if highlighter not initialized or resources not loaded
 */
export function highlightCodeSync(
  code: string,
  theme: BundledTheme,
  lang: BundledLanguage
): string {
  const hl = highlighterInstance;
  if (!hl) throw new Error("Highlighter not initialized");
  if (!loadedThemes.has(theme)) throw new Error(`Theme ${theme} not loaded`);
  if (!loadedLanguages.has(lang)) throw new Error(`Language ${lang} not loaded`);

  return hl.codeToHtml(code, { lang, theme });
}
