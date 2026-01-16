import { Suspense } from "react";
import { X } from "lucide-react";
import type { BundledLanguage, BundledTheme } from "shiki";
import { ThemeSelector } from "./ThemeSelector";
import { EditableCodeBlock } from "./EditableCodeBlock";
import { CodeBlockSkeleton } from "./LoadingFallback";

interface CodePanelProps {
  theme: BundledTheme;
  onThemeChange: (theme: BundledTheme) => void;
  code: string;
  onCodeChange: (code: string) => void;
  language: BundledLanguage;
  onRemove: () => void;
  canRemove: boolean;
}

/**
 * A single code panel with theme selector and editable code block.
 */
export function CodePanel({
  theme,
  onThemeChange,
  code,
  onCodeChange,
  language,
  onRemove,
  canRemove,
}: CodePanelProps) {
  return (
    <div className="flex flex-col min-w-[360px] flex-1 border-r border-gray-700 last:border-r-0">
      {/* Panel header */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 bg-gray-800 border-b border-gray-700">
        <ThemeSelector value={theme} onChange={onThemeChange} />
        {canRemove && (
          <button
            onClick={onRemove}
            className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
            aria-label="Remove panel"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Code block with Suspense */}
      <Suspense fallback={<CodeBlockSkeleton />}>
        <EditableCodeBlock
          code={code}
          onCodeChange={onCodeChange}
          theme={theme}
          language={language}
        />
      </Suspense>
    </div>
  );
}
