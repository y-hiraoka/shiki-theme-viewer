import { Suspense } from "react";
import { ThemeComparisonPage } from "./components/ThemeComparisonPage";
import { LoadingFallback } from "./components/LoadingFallback";

function App() {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <ThemeComparisonPage />
    </Suspense>
  );
}

function FullPageLoader() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <LoadingFallback message="Initializing editor..." />
    </div>
  );
}

export default App;
