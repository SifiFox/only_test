import type { SlideCategory } from "@/entities";
import { useMemo, useState } from "react";

interface UseTimelapsStateParams {
  slides: SlideCategory[];
  isMobile: boolean;
}

interface UseTimelapsStateResult {
  activeSlideId: number;
  activeSlide: SlideCategory | undefined;
  safeActiveSlideIndex: number;
  totalSlidesCount: number;
  isOuterSettled: boolean;
  setOuterSettled: (isSettled: boolean) => void;
  setActiveOuterSlide: (nextSlideId: number) => void;
  handleOuterPrev: () => void;
  handleOuterNext: () => void;
}

export function useTimelapsState({
  slides,
  isMobile,
}: UseTimelapsStateParams): UseTimelapsStateResult {
  const [activeSlideId, setActiveSlideId] = useState<number>(slides[0]?.id ?? 0);
  const [isOuterSettled, setIsOuterSettled] = useState(true);

  const totalSlidesCount = slides.length;
  const activeSlideIndex = useMemo(
    () => slides.findIndex((slide) => slide.id === activeSlideId),
    [activeSlideId, slides],
  );
  const safeActiveSlideIndex = activeSlideIndex < 0 ? 0 : activeSlideIndex;
  const activeSlide = slides[safeActiveSlideIndex];

  function setActiveOuterSlide(nextSlideId: number): void {
    if (!isMobile) {
      setIsOuterSettled(false);
    }

    setActiveSlideId(nextSlideId);
  }

  function handleOuterPrev(): void {
    if (!totalSlidesCount) {
      return;
    }

    const previousSlideIndex = (safeActiveSlideIndex - 1 + totalSlidesCount) % totalSlidesCount;
    setActiveOuterSlide(slides[previousSlideIndex].id);
  }

  function handleOuterNext(): void {
    if (!totalSlidesCount) {
      return;
    }

    const nextSlideIndex = (safeActiveSlideIndex + 1) % totalSlidesCount;
    setActiveOuterSlide(slides[nextSlideIndex].id);
  }

  return {
    activeSlideId,
    activeSlide,
    safeActiveSlideIndex,
    totalSlidesCount,
    isOuterSettled,
    setOuterSettled: setIsOuterSettled,
    setActiveOuterSlide,
    handleOuterPrev,
    handleOuterNext,
  };
}
