import gsap from "gsap";

interface AnimateTimelapsCarouselContentOutParams {
  element: HTMLElement;
  onComplete: () => void;
}

interface AnimateTimelapsCarouselContentInParams {
  element: HTMLElement;
}

export function animateTimelapsCarouselContentOut({
  element,
  onComplete,
}: AnimateTimelapsCarouselContentOutParams): gsap.core.Tween {
  return gsap.to(element, {
    autoAlpha: 0,
    y: 10,
    duration: 0.24,
    ease: "power2.out",
    onComplete,
  });
}

export function animateTimelapsCarouselContentIn({
  element,
}: AnimateTimelapsCarouselContentInParams): gsap.core.Tween {
  return gsap.fromTo(
    element,
    { autoAlpha: 0, y: 10 },
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.3,
      ease: "power2.out",
    },
  );
}
