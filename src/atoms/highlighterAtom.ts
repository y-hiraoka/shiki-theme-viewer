import { atom } from "jotai";
import type { Highlighter } from "shiki";

/**
 * Async atom that holds the Shiki highlighter instance.
 * Lazily initializes the highlighter with no themes or languages loaded.
 */
export const highlighterAtom = atom<Promise<Highlighter>>(async () => {
  const { createHighlighter } = await import("shiki");
  return createHighlighter({ themes: [], langs: [] });
});
