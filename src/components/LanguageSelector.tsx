import type React from "react";
import { ChevronDown as ChevronDownIcon } from "lucide-react";
import type { BundledLanguage } from "shiki";
import { getSortedLanguages } from "../lib/shiki/languages";

interface LanguageSelectorProps {
  value: BundledLanguage;
  onChange: (lang: BundledLanguage) => void;
}

// Pre-compute sorted languages
const sortedLanguages = getSortedLanguages();

/**
 * A dropdown selector for choosing a programming language.
 * Popular languages are shown at the top of the list.
 */
export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as BundledLanguage)}
        className="appearance-none bg-gray-700 text-gray-200 text-sm px-3 py-1.5 pr-8 rounded border border-gray-600 hover:border-gray-500 focus:border-blue-500 focus:outline-none cursor-pointer"
      >
        {sortedLanguages.map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
    </div>
  );
};
