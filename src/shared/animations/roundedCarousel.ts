import gsap from "gsap";

interface AnimateRoundedCarouselRotationParams {
  fromDeg: number;
  toDeg: number;
  durationSec?: number;
  onUpdate: (rotationDeg: number) => void;
  onComplete?: () => void;
}

export function animateRoundedCarouselRotation({
  fromDeg,
  toDeg,
  durationSec = 0.42,
  onUpdate,
  onComplete,
}: AnimateRoundedCarouselRotationParams): gsap.core.Tween {
  const state = { rotationDeg: fromDeg };

  return gsap.to(state, {
    rotationDeg: toDeg,
    duration: durationSec,
    ease: "power2.inOut",
    onUpdate: () => {
      onUpdate(state.rotationDeg);
    },
    onComplete,
  });
}
