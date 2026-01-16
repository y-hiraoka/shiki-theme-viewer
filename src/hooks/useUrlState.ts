import {
  parseAsArrayOf,
  parseAsString,
  useQueryState,
  useQueryStates,
} from "nuqs";
import { DEFAULT_LANGUAGE, DEFAULT_THEME } from "../constants/defaults";

/**
 * Parser for the themes array URL parameter.
 * Themes are stored as comma-separated values.
 */
const parseAsThemes = parseAsArrayOf(parseAsString, ",").withDefault([
  DEFAULT_THEME,
]);

/**
 * Parser for the language URL parameter.
 */
const parseAsLanguage = parseAsString.withDefault(DEFAULT_LANGUAGE);

/**
 * Parser for the compressed code URL parameter.
 * Note: The code is stored compressed; decompression happens in components.
 */
const parseAsCompressedCode = parseAsString;

/**
 * Hook for managing the themes array in URL state.
 * @returns [themes, setThemes] tuple
 */
export function useThemesState() {
  return useQueryState("themes", parseAsThemes);
}

/**
 * Hook for managing the language in URL state.
 * @returns [language, setLanguage] tuple
 */
export function useLanguageState() {
  return useQueryState("lang", parseAsLanguage);
}

/**
 * Hook for managing the compressed code in URL state.
 * @returns [code, setCode] tuple where code may be null if not set
 */
export function useCompressedCodeState() {
  return useQueryState("code", parseAsCompressedCode);
}

/**
 * Hook for managing all URL state at once.
 * Useful for batch updates to avoid multiple URL changes.
 */
export function useAllUrlState() {
  return useQueryStates({
    themes: parseAsThemes,
    lang: parseAsLanguage,
    code: parseAsCompressedCode,
  });
}
