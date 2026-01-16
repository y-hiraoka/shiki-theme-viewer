import { Plus } from "lucide-react";
import type { BundledLanguage } from "shiki";
import { LanguageSelector } from "./LanguageSelector";

interface HeaderProps {
  language: BundledLanguage;
  onLanguageChange: (lang: BundledLanguage) => void;
  onAddPanel: () => void;
}

/**
 * The page header with language selector and add panel button.
 */
export function Header({
  language,
  onLanguageChange,
  onAddPanel,
}: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-700">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-white">Shiki Theme Viewer</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Language:</span>
          <LanguageSelector value={language} onChange={onLanguageChange} />
        </div>
      </div>
      <button
        onClick={onAddPanel}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-200 bg-gray-700 hover:bg-gray-600 rounded border border-gray-600 transition-colors"
      >
        <Plus className="h-4 w-4" />
        Add Panel
      </button>
    </header>
  );
}
