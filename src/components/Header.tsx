import type React from "react";
import { Plus as PlusIcon } from "lucide-react";
import { useAtom } from "jotai";
import type { BundledTheme } from "shiki";
import { LanguageSelector } from "./LanguageSelector";
import { languageAtom, themesAtom } from "../atoms/searchParamsAtom";

/**
 * The page header with language selector and add panel button.
 */
export const Header: React.FC = () => {
  const [language, setLanguage] = useAtom(languageAtom);
  const [themes, setThemes] = useAtom(themesAtom);

  const handleAddPanel = () => {
    // Add a new panel with a different theme
    const availableThemes: BundledTheme[] = [
      "github-dark",
      "github-light",
      "nord",
      "dracula",
      "one-dark-pro",
      "solarized-light",
      "material-theme-darker",
      "vitesse-dark",
    ];

    // Find a theme not already in use
    const usedThemes = new Set(themes);
    const newTheme =
      availableThemes.find((t) => !usedThemes.has(t)) ?? "github-light";

    setThemes([...themes, newTheme]);
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-700">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-white">Shiki Theme Viewer</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Language:</span>
          <LanguageSelector value={language} onChange={setLanguage} />
        </div>
      </div>
      <button
        onClick={handleAddPanel}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-200 bg-gray-700 hover:bg-gray-600 rounded border border-gray-600 transition-colors"
      >
        <PlusIcon className="h-4 w-4" />
        Add Panel
      </button>
    </header>
  );
};
