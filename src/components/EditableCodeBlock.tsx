import { useRef, useEffect, useMemo } from "react";
import type { BundledLanguage, BundledTheme } from "shiki";
import { useHighlightedCode } from "../hooks/useHighlightedCode";

interface EditableCodeBlockProps {
  code: string;
  onCodeChange: (code: string) => void;
  theme: BundledTheme;
  language: BundledLanguage;
}

/**
 * Extracts the background color from Shiki's HTML output.
 * @param html - The highlighted HTML from Shiki
 * @returns The background color or a default
 */
function extractBackgroundColor(html: string): string {
  const match = html.match(/background-color:\s*([^;"]+)/);
  return match?.[1] ?? "#1e1e1e";
}

/**
 * An editable code block with syntax highlighting.
 * Uses a transparent textarea overlaid on highlighted code.
 */
export function EditableCodeBlock({
  code,
  onCodeChange,
  theme,
  language,
}: EditableCodeBlockProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightedRef = useRef<HTMLDivElement>(null);
  const highlightedHtml = useHighlightedCode(code, theme, language);

  const backgroundColor = useMemo(
    () => extractBackgroundColor(highlightedHtml),
    [highlightedHtml]
  );

  // Sync scroll position between textarea and highlighted code
  useEffect(() => {
    const textarea = textareaRef.current;
    const highlighted = highlightedRef.current;

    if (!textarea || !highlighted) return;

    const handleScroll = () => {
      highlighted.scrollTop = textarea.scrollTop;
      highlighted.scrollLeft = textarea.scrollLeft;
    };

    textarea.addEventListener("scroll", handleScroll);
    return () => textarea.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="relative flex-1 overflow-hidden font-mono text-sm leading-relaxed"
      style={{ backgroundColor }}
    >
      {/* Highlighted code layer (visual only) */}
      <div
        ref={highlightedRef}
        className="absolute inset-0 overflow-hidden pointer-events-none p-4 [&_pre]:!bg-transparent [&_pre]:!m-0 [&_pre]:!p-0 [&_code]:!bg-transparent"
        dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        aria-hidden="true"
      />

      {/* Textarea overlay (interactive) */}
      <textarea
        ref={textareaRef}
        value={code}
        onChange={(e) => onCodeChange(e.target.value)}
        className="relative w-full h-full min-h-[400px] p-4 bg-transparent text-transparent caret-white selection:bg-blue-500/30 resize-none outline-none font-mono text-sm leading-relaxed whitespace-pre overflow-auto"
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        autoComplete="off"
        data-gramm="false"
      />
    </div>
  );
}
