import gsap from "gsap";
import type { TimelapsAnimation } from "@/shared/animations/types";

export const animationSlideUp: TimelapsAnimation = ({ timelapsRef }) => {
    if (!timelapsRef.current) {
        return;
    }
    return gsap.fromTo(
        timelapsRef.current,
        { y: -35, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
    )
};