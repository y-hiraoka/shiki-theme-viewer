import { bundledThemes, type BundledTheme } from "shiki";

/**
 * List of all available Shiki themes.
 */
export const themeList: BundledTheme[] = Object.keys(
  bundledThemes
) as BundledTheme[];

/**
 * Checks if a string is a valid Shiki theme.
 * @param theme - The string to check
 * @returns True if the string is a valid theme
 */
export function isValidTheme(theme: string): theme is BundledTheme {
  return theme in bundledThemes;
}

/**
 * Validates and returns a valid theme, falling back to a default if invalid.
 * @param theme - The theme to validate
 * @param fallback - The fallback theme to use if invalid
 * @returns A valid theme
 */
export function validateTheme(
  theme: string,
  fallback: BundledTheme
): BundledTheme {
  return isValidTheme(theme) ? theme : fallback;
}
