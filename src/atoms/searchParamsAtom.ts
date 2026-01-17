import { atom } from "jotai";
import type { BundledTheme, BundledLanguage } from "shiki";
import { locationAtom } from "./locationAtom";
import { parseSearchParams } from "../lib/validation/searchParamsSchema";
import { DEFAULT_THEME, DEFAULT_LANGUAGE } from "../constants/defaults";

/**
 * Derived atom that parses and validates searchParams from location.
 */
const parsedSearchParamsAtom = atom((get) => {
  const location = get(locationAtom);
  return parseSearchParams(location.searchParams ?? undefined);
});

/**
 * Read-write atom for the selected themes array.
 * Read: Returns themes from URL (validated by valibot schema).
 * Write: Updates themes in URL.
 */
export const themesAtom = atom(
  (get): BundledTheme[] =>
    get(parsedSearchParamsAtom).themes ?? [DEFAULT_THEME],
  (get, set, themes: BundledTheme[]) => {
    const location = get(locationAtom);
    const params = new URLSearchParams(location.searchParams ?? undefined);
    params.set("themes", themes.join(","));
    set(locationAtom, { ...location, searchParams: params });
  }
);

/**
 * Read-write atom for the selected language.
 * Read: Returns language from URL (validated by valibot schema).
 * Write: Updates language in URL.
 */
export const languageAtom = atom(
  (get): BundledLanguage =>
    get(parsedSearchParamsAtom).lang ?? DEFAULT_LANGUAGE,
  (get, set, lang: BundledLanguage) => {
    const location = get(locationAtom);
    const params = new URLSearchParams(location.searchParams ?? undefined);
    params.set("lang", lang);
    set(locationAtom, { ...location, searchParams: params });
  }
);

