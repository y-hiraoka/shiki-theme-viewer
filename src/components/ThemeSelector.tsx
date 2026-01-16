import { ChevronDown } from "lucide-react";
import type { BundledTheme } from "shiki";
import { themeList } from "../lib/shiki/themes";

interface ThemeSelectorProps {
  value: BundledTheme;
  onChange: (theme: BundledTheme) => void;
}

/**
 * A dropdown selector for choosing a Shiki theme.
 */
export function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as BundledTheme)}
        className="appearance-none bg-gray-700 text-gray-200 text-sm px-3 py-1.5 pr-8 rounded border border-gray-600 hover:border-gray-500 focus:border-blue-500 focus:outline-none cursor-pointer"
      >
        {themeList.map((theme) => (
          <option key={theme} value={theme}>
            {theme}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
    </div>
  );
}
