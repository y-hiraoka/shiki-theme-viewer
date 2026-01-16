import type { ReactNode } from "react";

interface CodePanelContainerProps {
  children: ReactNode;
}

/**
 * A horizontally scrollable container for code panels.
 * Ensures panels maintain minimum width and fill available space.
 */
export function CodePanelContainer({ children }: CodePanelContainerProps) {
  return (
    <div className="flex-1 overflow-x-auto bg-gray-900">
      <div className="flex h-full min-w-max">{children}</div>
    </div>
  );
}
