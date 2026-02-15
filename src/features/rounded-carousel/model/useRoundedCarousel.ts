import type { SlideCategory } from "@/entities/slide/model";
import {
  getNextRotationByShortestPath,
  getPointBaseAngle,
  getTargetRotationForActiveIndex,
} from "@/features/rounded-carousel/model/helpers";
import { animateRoundedCarouselRotation } from "@/shared/animations";
import type { MouseEvent } from "react";
import type { RefObject } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface UseRoundedCarouselParams {
  slides: SlideCategory[];
  activeId?: number;
  defaultActiveId?: number;
  onActiveChange?: (id: number) => void;
}

export interface RoundedCarouselPoint {
  slide: SlideCategory;
  index: number;
  baseAngleDeg: number;
}

interface UseRoundedCarouselResult {
  isReadyToRender: boolean;
  safeActiveId: number | null;
  isSettled: boolean;
  pointsLayerRef: RefObject<HTMLDivElement | null>;
  points: RoundedCarouselPoint[];
  handlePointsLayerClick: (event: MouseEvent<HTMLDivElement>) => void;
}

const ROTATION_EPSILON = 0.01;
const ROTATION_DURATION_SEC = 0.9;

function getFallbackActiveId(slides: SlideCategory[]): number | null {
  return slides[0]?.id ?? null;
}

function hasSlideWithId({
  slides,
  slideId,
}: {
  slides: SlideCategory[];
  slideId?: number | null;
}): boolean {
  return slideId !== undefined && slideId !== null && slides.some((slide) => slide.id === slideId);
}

function resolveInitialActiveId({
  slides,
  activeId,
  defaultActiveId,
}: {
  slides: SlideCategory[];
  activeId?: number;
  defaultActiveId?: number;
}): number | null {
  if (activeId !== undefined && hasSlideWithId({ slides, slideId: activeId })) {
    return activeId;
  }

  if (defaultActiveId !== undefined && hasSlideWithId({ slides, slideId: defaultActiveId })) {
    return defaultActiveId;
  }

  return getFallbackActiveId(slides);
}

function extractPointPayloadFromEvent({
  event,
}: {
  event: MouseEvent<HTMLDivElement>;
}): { targetId: number; targetIndex: number } | null {
  if (!(event.target instanceof Element)) {
    return null;
  }

  const clickablePoint = event.target.closest("button[data-slide-id][data-slide-index]");
  if (!(clickablePoint instanceof HTMLButtonElement)) {
    return null;
  }

  if (!event.currentTarget.contains(clickablePoint)) {
    return null;
  }

  const targetId = Number.parseInt(clickablePoint.dataset.slideId ?? "", 10);
  const targetIndex = Number.parseInt(clickablePoint.dataset.slideIndex ?? "", 10);
  if (!Number.isFinite(targetId) || !Number.isFinite(targetIndex)) {
    return null;
  }

  return { targetId, targetIndex };
}

export function useRoundedCarousel({
  slides,
  activeId,
  defaultActiveId,
  onActiveChange,
}: UseRoundedCarouselParams): UseRoundedCarouselResult {
  const isControlled = activeId !== undefined;
  const initialActiveId = resolveInitialActiveId({ slides, activeId, defaultActiveId });

  const [internalActiveId, setInternalActiveId] = useState<number | null>(initialActiveId);
  const [isSettled, setIsSettled] = useState(true);

  const rotationRef = useRef(0);
  const pointsLayerRef = useRef<HTMLDivElement | null>(null);
  const rotationTweenRef = useRef<ReturnType<typeof animateRoundedCarouselRotation> | null>(null);
  const hasInitializedRotationRef = useRef(false);

  const currentActiveId = isControlled ? activeId ?? getFallbackActiveId(slides) : internalActiveId;
  const safeActiveId =
    currentActiveId !== null && hasSlideWithId({ slides, slideId: currentActiveId })
      ? currentActiveId
      : getFallbackActiveId(slides);

  const activeIndex = slides.findIndex((slide) => slide.id === safeActiveId);
  const resolvedActiveIndex = activeIndex === -1 ? 0 : activeIndex;

  const points = useMemo<RoundedCarouselPoint[]>(() => {
    const totalPoints = slides.length;

    return slides.map((slide, index) => ({
      slide,
      index,
      baseAngleDeg: getPointBaseAngle({ index, totalPoints }),
    }));
  }, [slides]);

  const applyLayerRotation = useCallback((rotationDeg: number) => {
    if (!pointsLayerRef.current) {
      return;
    }

    pointsLayerRef.current.style.transform = `translate(-50%, -50%) rotate(${rotationDeg}deg)`;
    pointsLayerRef.current.style.setProperty("--rotation-deg", `${rotationDeg}deg`);
  }, []);

  const rotateToIndex = useCallback(
    (targetIndex: number) => {
      if (!slides.length) {
        return;
      }

      const targetRotationDeg = getTargetRotationForActiveIndex({
        activeIndex: targetIndex,
        totalPoints: slides.length,
      });

      if (!hasInitializedRotationRef.current) {
        applyLayerRotation(targetRotationDeg);
        rotationRef.current = targetRotationDeg;
        hasInitializedRotationRef.current = true;
        setIsSettled(true);
        return;
      }

      const nextRotationDeg = getNextRotationByShortestPath({
        currentRotationDeg: rotationRef.current,
        targetRotationDeg,
      });

      const rotationDelta = Math.abs(nextRotationDeg - rotationRef.current);
      rotationTweenRef.current?.kill();

      if (rotationDelta <= ROTATION_EPSILON) {
        rotationRef.current = nextRotationDeg;
        applyLayerRotation(nextRotationDeg);
        setIsSettled(true);
        return;
      }

      setIsSettled(false);
      rotationTweenRef.current = animateRoundedCarouselRotation({
        fromDeg: rotationRef.current,
        toDeg: nextRotationDeg,
        durationSec: ROTATION_DURATION_SEC,
        onUpdate: (currentRotationDeg) => {
          rotationRef.current = currentRotationDeg;
          applyLayerRotation(currentRotationDeg);
        },
        onComplete: () => {
          rotationRef.current = nextRotationDeg;
          applyLayerRotation(nextRotationDeg);
          setIsSettled(true);
        },
      });
    },
    [applyLayerRotation, slides],
  );

  const handlePointClick = useCallback(
    ({ targetId, targetIndex }: { targetId: number; targetIndex: number }) => {
      if (!isControlled) {
        setInternalActiveId(targetId);
      }

      onActiveChange?.(targetId);
      rotateToIndex(targetIndex);
    },
    [isControlled, onActiveChange, rotateToIndex],
  );

  const handlePointsLayerClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const pointPayload = extractPointPayloadFromEvent({ event });
      if (!pointPayload) {
        return;
      }

      handlePointClick(pointPayload);
    },
    [handlePointClick],
  );

  useEffect(() => {
    if (!slides.length || isControlled) {
      return;
    }

    if (hasSlideWithId({ slides, slideId: internalActiveId })) {
      return;
    }

    setInternalActiveId(getFallbackActiveId(slides));
  }, [internalActiveId, isControlled, slides]);

  useEffect(() => {
    if (!slides.length) {
      return;
    }

    rotateToIndex(resolvedActiveIndex);
  }, [resolvedActiveIndex, rotateToIndex, slides.length]);

  useEffect(() => {
    return () => {
      rotationTweenRef.current?.kill();
    };
  }, []);

  return {
    isReadyToRender: Boolean(slides.length) && safeActiveId !== null,
    safeActiveId,
    isSettled,
    pointsLayerRef,
    points,
    handlePointsLayerClick,
  };
}
