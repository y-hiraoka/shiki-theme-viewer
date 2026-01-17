import type React from "react";
import { useAtom, useAtomValue } from "jotai";
import { Header } from "./Header";
import { CodePanelContainer } from "./CodePanelContainer";
import { CodePanel } from "./CodePanel";
import { themesAtom } from "../atoms/searchParamsAtom";
import { syncCodeToUrlEffectAtom } from "../atoms/codeAtom";

/**
 * The main theme comparison page component.
 */
export const ThemeComparisonPage: React.FC = () => {
  // Read themes for rendering panels
  const themes = useAtomValue(themesAtom);

  // Activate jotai-effect for code sync to URL
  useAtom(syncCodeToUrlEffectAtom);

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <Header />

      <CodePanelContainer>
        {themes.map((theme, index) => (
          <CodePanel key={`${index}-${theme}`} index={index} />
        ))}
      </CodePanelContainer>
    </div>
  );
};
