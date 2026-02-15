import gsap from "gsap";

interface AnimateYearCounterParams {
  from: number;
  to: number;
  durationSec?: number;
  onUpdate: (value: number) => void;
  onComplete?: () => void;
}

export function animateYearCounter({
  from,
  to,
  durationSec = 0.6,
  onUpdate,
  onComplete,
}: AnimateYearCounterParams): gsap.core.Tween {
  const state = { value: from };

  return gsap.to(state, {
    value: to,
    duration: durationSec,
    ease: "power2.out",
    onUpdate: () => {
      onUpdate(Math.round(state.value));
    },
    onComplete,
  });
}
