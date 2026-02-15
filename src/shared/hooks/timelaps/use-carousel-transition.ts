import { type RefObject, useEffect, useRef, useState } from "react";
import {
  animateTimelapsCarouselContentIn,
  animateTimelapsCarouselContentOut,
} from "../../../widgets/timelaps/model/animations";

interface UseCarouselTransitionParams {
  activeSlideId: number;
  isMobile: boolean;
  isOuterSettled: boolean;
}

interface UseCarouselTransitionResult {
  displayedSlideId: number;
  innerContentRef: RefObject<HTMLDivElement | null>;
}

export function useCarouselTransition({
  activeSlideId,
  isMobile,
  isOuterSettled,
}: UseCarouselTransitionParams): UseCarouselTransitionResult {
  const [displayedSlideId, setDisplayedSlideId] = useState(activeSlideId);
  const [pendingSlideId, setPendingSlideId] = useState<number | null>(null);
  const [isContentHidden, setIsContentHidden] = useState(false);
  const innerContentRef = useRef<HTMLDivElement | null>(null);
  const transitionOutTweenRef = useRef<ReturnType<typeof animateTimelapsCarouselContentOut> | null>(null);
  const transitionInTweenRef = useRef<ReturnType<typeof animateTimelapsCarouselContentIn> | null>(null);
  const previousDisplayedSlideIdRef = useRef(displayedSlideId);

  useEffect(() => {
    if (displayedSlideId === activeSlideId) {
      return;
    }

    setPendingSlideId(activeSlideId);

    if (!innerContentRef.current || isContentHidden) {
      return;
    }

    transitionInTweenRef.current?.kill();
    transitionOutTweenRef.current?.kill();
    transitionOutTweenRef.current = animateTimelapsCarouselContentOut({
      element: innerContentRef.current,
      onComplete: () => {
        setIsContentHidden(true);
      },
    });

    return () => {
      transitionOutTweenRef.current?.kill();
    };
  }, [activeSlideId, displayedSlideId, isContentHidden]);

  useEffect(() => {
    const canShowNextContent = isMobile || isOuterSettled;
    if (pendingSlideId === null || !canShowNextContent || !isContentHidden) {
      return;
    }

    setDisplayedSlideId(pendingSlideId);
    setPendingSlideId(null);
  }, [isContentHidden, isMobile, isOuterSettled, pendingSlideId]);

  useEffect(() => {
    if (previousDisplayedSlideIdRef.current === displayedSlideId || !innerContentRef.current) {
      return;
    }

    previousDisplayedSlideIdRef.current = displayedSlideId;
    transitionInTweenRef.current?.kill();
    transitionInTweenRef.current = animateTimelapsCarouselContentIn({
      element: innerContentRef.current,
    });
    setIsContentHidden(false);
  }, [displayedSlideId]);

  useEffect(() => {
    return () => {
      transitionOutTweenRef.current?.kill();
      transitionInTweenRef.current?.kill();
    };
  }, []);

  return {
    displayedSlideId,
    innerContentRef,
  };
}
