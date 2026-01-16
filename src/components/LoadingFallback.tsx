import { Loader2 } from "lucide-react";

interface LoadingFallbackProps {
  message?: string;
}

/**
 * A loading spinner component used as a Suspense fallback.
 */
export function LoadingFallback({
  message = "Loading...",
}: LoadingFallbackProps) {
  return (
    <div className="flex items-center justify-center gap-2 p-8 text-gray-400">
      <Loader2 className="h-5 w-5 animate-spin" />
      <span>{message}</span>
    </div>
  );
}

/**
 * A skeleton loading state for code blocks.
 */
export function CodeBlockSkeleton() {
  return (
    <div className="flex-1 bg-gray-800 p-4 animate-pulse">
      <div className="space-y-2">
        <div className="h-4 bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-700 rounded w-1/2" />
        <div className="h-4 bg-gray-700 rounded w-5/6" />
        <div className="h-4 bg-gray-700 rounded w-2/3" />
        <div className="h-4 bg-gray-700 rounded w-4/5" />
        <div className="h-4 bg-gray-700 rounded w-1/3" />
        <div className="h-4 bg-gray-700 rounded w-3/5" />
        <div className="h-4 bg-gray-700 rounded w-2/4" />
      </div>
    </div>
  );
}
