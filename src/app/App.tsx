import { animationSlideUp } from "@/shared";
import { AnimatedTimelaps } from "@/widgets";


export function App() {

  return (
    <main className="app">
      <AnimatedTimelaps animation={animationSlideUp}/>
    </main>
  );
}
