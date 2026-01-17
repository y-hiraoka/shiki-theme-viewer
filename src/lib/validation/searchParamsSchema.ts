import * as v from "valibot";
import { bundledThemes, bundledLanguages } from "shiki";
import type { BundledTheme, BundledLanguage } from "shiki";
import { DEFAULT_THEME, DEFAULT_LANGUAGE } from "../../constants/defaults";

/**
 * Schema for parsing themes parameter (comma-separated string to array).
 * Invalid themes are replaced with the default theme.
 */
export const themesParamSchema = v.pipe(
  v.optional(v.string()),
  v.transform((val): BundledTheme[] => {
    if (!val || val.trim() === "") {
      return [DEFAULT_THEME];
    }
    const themes = val
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (themes.length === 0) {
      return [DEFAULT_THEME];
    }
    return themes.map((t) =>
      t in bundledThemes ? (t as BundledTheme) : DEFAULT_THEME
    );
  })
);

/**
 * Schema for parsing language parameter.
 * Invalid languages are replaced with the default language.
 */
export const langParamSchema = v.pipe(
  v.optional(v.string()),
  v.transform((val): BundledLanguage => {
    if (val && val in bundledLanguages) {
      return val as BundledLanguage;
    }
    return DEFAULT_LANGUAGE;
  })
);

/**
 * Combined schema for all searchParams.
 */
export const searchParamsSchema = v.object({
  themes: themesParamSchema,
  lang: langParamSchema,
});

export type ParsedSearchParams = v.InferOutput<typeof searchParamsSchema>;

/**
 * Parses URLSearchParams into validated search params.
 * @param params - The URLSearchParams to parse
 * @returns Validated and transformed search params
 */
export function parseSearchParams(
  params: URLSearchParams | undefined
): ParsedSearchParams {
  return v.parse(searchParamsSchema, {
    themes: params?.get("themes") ?? undefined,
    lang: params?.get("lang") ?? undefined,
  });
}
