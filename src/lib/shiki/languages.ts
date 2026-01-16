import { bundledLanguages, type BundledLanguage } from "shiki";

/**
 * List of all available Shiki languages.
 */
export const languageList: BundledLanguage[] = Object.keys(
  bundledLanguages
) as BundledLanguage[];

/**
 * Popular languages to show at the top of the language selector.
 */
export const popularLanguages: BundledLanguage[] = [
  "typescript",
  "javascript",
  "python",
  "rust",
  "go",
  "java",
  "c",
  "cpp",
  "csharp",
  "ruby",
  "php",
  "swift",
  "kotlin",
  "html",
  "css",
  "json",
  "yaml",
  "markdown",
  "sql",
  "bash",
];

/**
 * Gets a sorted list of languages with popular ones at the top.
 * @returns Sorted language list
 */
export function getSortedLanguages(): BundledLanguage[] {
  const popular = popularLanguages.filter((lang) =>
    languageList.includes(lang)
  );
  const others = languageList
    .filter((lang) => !popularLanguages.includes(lang))
    .sort();

  return [...popular, ...others];
}

/**
 * Checks if a string is a valid Shiki language.
 * @param lang - The string to check
 * @returns True if the string is a valid language
 */
export function isValidLanguage(lang: string): lang is BundledLanguage {
  return lang in bundledLanguages;
}

/**
 * Validates and returns a valid language, falling back to a default if invalid.
 * @param lang - The language to validate
 * @param fallback - The fallback language to use if invalid
 * @returns A valid language
 */
export function validateLanguage(
  lang: string,
  fallback: BundledLanguage
): BundledLanguage {
  return isValidLanguage(lang) ? lang : fallback;
}
