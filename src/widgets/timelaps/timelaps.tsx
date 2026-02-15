import { useSlides } from "@/entities/slide/model";
import type { SlideCategory } from "@/entities/slide/model";
import { RoundedCarousel } from "@/features";
import { animateYearCounter } from "@/shared/animations";
import type { TimelapsAnimation, TimelapsAnimationResult } from "@/shared/animations/types";
import { Typography } from "@/shared/ui";
import { forwardRef, type ReactNode, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import styles from "./timelaps.module.scss";

interface TimelapsBaseProps {
  fallback?: ReactNode;
  emptyFallback?: ReactNode;
}

interface TimelapsProps extends TimelapsBaseProps { }

interface AnimatedTimelapsProps extends TimelapsBaseProps {
  animation: TimelapsAnimation;
}

const CONTENT = {
  loading: "isFetching",
  empty: "!data",
  title: "Исторические даты",
} as const;

const DEFAULT_ERROR = "Не удалось загрузить данные";

interface TimelapsContentProps {
  slides: SlideCategory[];
}

function parseYear(value: string): number | null {
  const parsedValue = Number.parseInt(value, 10);
  return Number.isFinite(parsedValue) ? parsedValue : null;
}

const TimelapsContent = forwardRef<HTMLDivElement, TimelapsContentProps>(function TimelapsContent(
  { slides },
  ref,
) {
  const [activeSlideId, setActiveSlideId] = useState<number>(slides[0]?.id ?? 0);

  const activeSlide = useMemo(
    () => slides.find((slide) => slide.id === activeSlideId) ?? slides[0],
    [activeSlideId, slides],
  );

  const { dateFrom, dateTo } = useMemo(() => {
    if (!activeSlide) {
      return { dateFrom: "", dateTo: "" };
    }

    const years = activeSlide.dates
      .map((date) => Number.parseInt(date.year, 10))
      .filter((year): year is number => Number.isFinite(year))
      .sort((firstYear, secondYear) => firstYear - secondYear);

    if (!years.length) {
      return { dateFrom: "", dateTo: "" };
    }

    return {
      dateFrom: String(years[0]),
      dateTo: String(years[years.length - 1]),
    };
  }, [activeSlide]);

  const [animatedDateFrom, setAnimatedDateFrom] = useState(dateFrom);
  const [animatedDateTo, setAnimatedDateTo] = useState(dateTo);

  const animatedFromValueRef = useRef<number>(parseYear(dateFrom) ?? 0);
  const animatedToValueRef = useRef<number>(parseYear(dateTo) ?? 0);

  const dateFromTweenRef = useRef<ReturnType<typeof animateYearCounter> | null>(null);
  const dateToTweenRef = useRef<ReturnType<typeof animateYearCounter> | null>(null);

  useEffect(() => {
    const targetDateFrom = parseYear(dateFrom);
    if (targetDateFrom === null) {
      dateFromTweenRef.current?.kill();
      setAnimatedDateFrom(dateFrom);
      return;
    }

    if (animatedFromValueRef.current === targetDateFrom) {
      setAnimatedDateFrom(String(targetDateFrom));
      return;
    }

    dateFromTweenRef.current?.kill();
    dateFromTweenRef.current = animateYearCounter({
      from: animatedFromValueRef.current,
      to: targetDateFrom,
      onUpdate: (nextYear) => {
        animatedFromValueRef.current = nextYear;
        setAnimatedDateFrom(String(nextYear));
      },
      onComplete: () => {
        animatedFromValueRef.current = targetDateFrom;
        setAnimatedDateFrom(String(targetDateFrom));
      },
    });
  }, [dateFrom]);

  useEffect(() => {
    const targetDateTo = parseYear(dateTo);
    if (targetDateTo === null) {
      dateToTweenRef.current?.kill();
      setAnimatedDateTo(dateTo);
      return;
    }

    if (animatedToValueRef.current === targetDateTo) {
      setAnimatedDateTo(String(targetDateTo));
      return;
    }

    dateToTweenRef.current?.kill();
    dateToTweenRef.current = animateYearCounter({
      from: animatedToValueRef.current,
      to: targetDateTo,
      onUpdate: (nextYear) => {
        animatedToValueRef.current = nextYear;
        setAnimatedDateTo(String(nextYear));
      },
      onComplete: () => {
        animatedToValueRef.current = targetDateTo;
        setAnimatedDateTo(String(targetDateTo));
      },
    });
  }, [dateTo]);

  useEffect(() => {
    return () => {
      dateFromTweenRef.current?.kill();
      dateToTweenRef.current?.kill();
    };
  }, []);

  return (
    <div ref={ref} className={styles.layout}>
      <Typography.h1 className={styles.title}>{CONTENT.title}</Typography.h1>
      <RoundedCarousel
        slides={slides}
        activeId={activeSlideId}
        onActiveChange={setActiveSlideId}
      >
        <div className={styles.carousel_content}>
          <span>{animatedDateFrom}</span>
          <span>{animatedDateTo}</span>
        </div>
      </RoundedCarousel>
    </div>
  );
});

function getAnimationCleanup(animationResult: TimelapsAnimationResult): (() => void) | null {
  if (typeof animationResult === "function") {
    return animationResult;
  }

  if (animationResult && "kill" in animationResult) {
    return () => animationResult.kill();
  }

  return null;
}

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

  return <TimelapsContent ref={timelapsRef} slides={data} />;
}