import { TimelapsSkeleton } from "@/widgets/timelaps/ui/timelaps-skeleton";
import { lazy, Suspense } from "react";

const TimelapsPage = lazy(() => import("./timelaps-page"));

export function App() {
  return (
    <main className="app">
      <Suspense fallback={<TimelapsSkeleton />}>
        <TimelapsPage />
      </Suspense>
    </main>
  );
}
