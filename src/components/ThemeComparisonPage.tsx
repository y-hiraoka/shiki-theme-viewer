import {
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import type { BundledLanguage, BundledTheme } from "shiki";
import { Header } from "./Header";
import { CodePanelContainer } from "./CodePanelContainer";
import { CodePanel } from "./CodePanel";
import {
  useThemesState,
  useLanguageState,
  useCompressedCodeState,
} from "../hooks/useUrlState";
import { DEFAULT_CODE, DEFAULT_THEME } from "../constants/defaults";
import {
  compressCodeCached,
  decompressCodeCached,
} from "../lib/compression/code-codec";
import { validateTheme } from "../lib/shiki/themes";
import { validateLanguage } from "../lib/shiki/languages";

/**
 * Creates a promise for the initial code value.
 * If compressed code exists in URL, decompress it; otherwise use default.
 */
function createInitialCodePromise(
  compressedCode: string | null
): Promise<string> {
  if (!compressedCode) {
    return Promise.resolve(DEFAULT_CODE);
  }

  return decompressCodeCached(compressedCode).catch(() => {
    // If decompression fails, return default code
    console.warn("Failed to decompress code from URL, using default");
    return DEFAULT_CODE;
  });
}

/**
 * The main theme comparison page component.
 */
export function ThemeComparisonPage() {
  const [themes, setThemes] = useThemesState();
  const [language, setLanguage] = useLanguageState();
  const [compressedCode, setCompressedCode] = useCompressedCodeState();
  const [isPending, startTransition] = useTransition();

  // Validate themes and language from URL
  const validatedThemes = useMemo(
    () => themes.map((t) => validateTheme(t, DEFAULT_THEME)),
    [themes]
  );

  const validatedLanguage = useMemo(
    () => validateLanguage(language, "typescript"),
    [language]
  );

  // Create initial code promise for Suspense
  const initialCodePromise = useMemo(
    () => createInitialCodePromise(compressedCode),
    // Only run on initial mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Use React 19's use() to get initial code (suspends on first render)
  const initialCode = use(initialCodePromise);

  // Local code state for immediate UI updates
  const [code, setCode] = useState(initialCode);

  // Sync code to URL with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      startTransition(() => {
        compressCodeCached(code).then((compressed) => {
          setCompressedCode(compressed);
        });
      });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [code, setCompressedCode]);

  const handleLanguageChange = useCallback(
    (lang: BundledLanguage) => {
      startTransition(() => {
        setLanguage(lang);
      });
    },
    [setLanguage]
  );

  const handleAddPanel = useCallback(() => {
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
    const usedThemes = new Set(validatedThemes);
    const newTheme =
      availableThemes.find((t) => !usedThemes.has(t)) ?? "github-light";

    setThemes([...validatedThemes, newTheme]);
  }, [validatedThemes, setThemes]);

  const handleThemeChange = useCallback(
    (index: number, newTheme: BundledTheme) => {
      const newThemes = [...validatedThemes];
      newThemes[index] = newTheme;
      setThemes(newThemes);
    },
    [validatedThemes, setThemes]
  );

  const handleRemovePanel = useCallback(
    (index: number) => {
      if (validatedThemes.length <= 1) return;
      const newThemes = validatedThemes.filter((_, i) => i !== index);
      setThemes(newThemes);
    },
    [validatedThemes, setThemes]
  );

  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <Header
        language={validatedLanguage}
        onLanguageChange={handleLanguageChange}
        onAddPanel={handleAddPanel}
      />

      <CodePanelContainer>
        {validatedThemes.map((theme, index) => (
          <CodePanel
            key={`${index}-${theme}`}
            theme={theme}
            onThemeChange={(newTheme) => handleThemeChange(index, newTheme)}
            code={code}
            onCodeChange={handleCodeChange}
            language={validatedLanguage}
            onRemove={() => handleRemovePanel(index)}
            canRemove={validatedThemes.length > 1}
          />
        ))}
      </CodePanelContainer>

      {/* Loading indicator for URL sync */}
      {isPending && (
        <div className="fixed bottom-4 right-4 px-3 py-1.5 bg-gray-800 text-gray-400 text-sm rounded-lg border border-gray-700">
          Syncing...
        </div>
      )}
    </div>
  );
}
