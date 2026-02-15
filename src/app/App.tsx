import { animationSlideUp } from "@/shared/animations/slideUp";
import { AnimatedTimelaps, Timelaps } from "@/widgets";


export function App() {

  return (
    <main className="app">
      <AnimatedTimelaps animation={animationSlideUp}/>
    </main>
  );
}
