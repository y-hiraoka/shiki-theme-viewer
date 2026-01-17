import type React from "react";
import { Suspense } from "react";
import { useAtom } from "jotai";
import { X as XIcon } from "lucide-react";
import type { BundledTheme } from "shiki";
import { ThemeSelector } from "./ThemeSelector";
import { EditableCodeBlock } from "./EditableCodeBlock";
import { CodeBlockSkeleton } from "./LoadingFallback";
import { themesAtom } from "../atoms/searchParamsAtom";

interface CodePanelProps {
  index: number;
}

/**
 * A single code panel with theme selector and editable code block.
 */
export const CodePanel: React.FC<CodePanelProps> = ({ index }) => {
  const [themes, setThemes] = useAtom(themesAtom);

  const theme = themes[index];
  const canRemove = themes.length > 1;

  const handleThemeChange = (newTheme: BundledTheme) => {
    const newThemes = [...themes];
    newThemes[index] = newTheme;
    setThemes(newThemes);
  };

  const handleRemove = () => {
    if (!canRemove) return;
    const newThemes = themes.filter((_, i) => i !== index);
    setThemes(newThemes);
  };

  return (
    <div className="flex flex-col min-w-[360px] flex-1 border-r border-gray-700 last:border-r-0">
      {/* Panel header */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 bg-gray-800 border-b border-gray-700">
        <ThemeSelector value={theme} onChange={handleThemeChange} />
        {canRemove && (
          <button
            onClick={handleRemove}
            className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
            aria-label="Remove panel"
          >
            <XIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Code block with Suspense */}
      <Suspense fallback={<CodeBlockSkeleton />}>
        <EditableCodeBlock theme={theme} />
      </Suspense>
    </div>
  );
};
