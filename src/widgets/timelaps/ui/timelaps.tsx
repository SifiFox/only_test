import { type SlideCategory, useSlides } from "@/entities";
import { RoundedCarousel } from "@/features";
import type { TimelapsAnimation } from "@/shared";
import { forwardRef, type ReactNode, useLayoutEffect, useRef } from "react";
import {
  useAnimatedYearRange,
  useTimelapsState,
} from "@/shared";
import { TimelapsCarousel } from "@/features";
import { TimelapsSkeleton } from "./timelaps-skeleton";
import styles from "../timelaps.module.scss";
import { getAnimationCleanup, useIsMobile, useYearRange, Typography } from "@/shared";

interface TimelapsBaseProps {
  fallback?: ReactNode;
  emptyFallback?: ReactNode;
}

type TimelapsProps = TimelapsBaseProps;

interface AnimatedTimelapsProps extends TimelapsBaseProps {
  animation: TimelapsAnimation;
}

const MIN_SLIDES = 2;
const MAX_SLIDES = 6;

const CONTENT = {
  loading: <TimelapsSkeleton />,
  empty: "Данные не были загружены, видимо не судьба в этот раз",
  invalidSlidesCount: "Количество слайдов должно быть от 2 до 6",
  title: "Исторические даты",
} as const;

const DEFAULT_ERROR = "Не удалось загрузить данные";

function isValidSlidesCount(count: number): boolean {
  return count >= MIN_SLIDES && count <= MAX_SLIDES;
}

interface TimelapsContentProps {
  slides: SlideCategory[];
}

const TimelapsContent = forwardRef<HTMLDivElement, TimelapsContentProps>(function TimelapsContent(
  { slides },
  ref,
) {
  const isMobile = useIsMobile();
  const {
    activeSlideId,
    activeSlide,
    isOuterSettled,
    setOuterSettled,
    setActiveOuterSlide,
  } = useTimelapsState({ slides, isMobile });
  const { dateFrom, dateTo } = useYearRange({ activeSlide });
  const { animatedDateFrom, animatedDateTo } = useAnimatedYearRange({
    dateFrom,
    dateTo,
  });

  return (
    <div ref={ref} className={styles.layout}>
      <div className={styles.content}>
        <Typography.h1 className={styles.title}>{CONTENT.title}</Typography.h1>
        {isMobile ? (
          <div className={styles.carousel_content}>
            <span>{animatedDateFrom}</span>
            <span>{animatedDateTo}</span>
          </div>
        ) : null}
        <TimelapsCarousel
          slides={slides}
          activeSlideId={activeSlideId}
          onActiveChange={setActiveOuterSlide}
          isOuterSettled={isMobile ? true : isOuterSettled}
          isMobile={isMobile}
        />
      </div>

      {!isMobile ? (
        <RoundedCarousel
          slides={slides}
          activeId={activeSlideId}
          onActiveChange={setActiveOuterSlide}
          onSettledChange={setOuterSettled}
        >
          <div className={styles.carousel_content}>
            <span>{animatedDateFrom}</span>
            <span>{animatedDateTo}</span>
          </div>
        </RoundedCarousel>
      ) : null}
    </div>
  );
});

export const Timelaps = forwardRef<HTMLDivElement, TimelapsProps>(function Timelaps(
  { fallback = CONTENT.loading, emptyFallback = CONTENT.empty },
  ref,
) {
  const { data, isFetching, error, isError } = useSlides();

  if (isFetching) {
    return <>{fallback}</>;
  }

  if (isError) {
    return <>{error ?? DEFAULT_ERROR}</>;
  }

  if (!data) {
    return <>{emptyFallback}</>;
  }

  if (!isValidSlidesCount(data.length)) {
    return <>{CONTENT.invalidSlidesCount}</>;
  }

  return <TimelapsContent ref={ref} slides={data} />;
});

export function AnimatedTimelaps({
  animation,
  fallback = CONTENT.loading,
  emptyFallback = CONTENT.empty,
}: AnimatedTimelapsProps) {
  const { data, isFetching, error, isError } = useSlides();
  const timelapsRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (isFetching || isError || !data || !timelapsRef.current) {
      return;
    }

    const animationResult = animation({ timelapsRef });
    const cleanup = getAnimationCleanup(animationResult);
    return cleanup ?? undefined;
  }, [animation, data, isError, isFetching]);

  if (isFetching) {
    return <>{fallback}</>;
  }

  if (isError) {
    return <>{error ?? DEFAULT_ERROR}</>;
  }

  if (!data) {
    return <>{emptyFallback}</>;
  }

  if (!isValidSlidesCount(data.length)) {
    return <>{CONTENT.invalidSlidesCount}</>;
  }

  return <TimelapsContent ref={timelapsRef} slides={data} />;
}
