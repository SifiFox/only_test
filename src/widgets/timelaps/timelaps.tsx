import { useSlides } from "@/entities/slide/model";
import type { TimelapsAnimation, TimelapsAnimationResult } from "@/shared/animations/types";
import { Typography } from "@/shared/ui";
import { forwardRef, type ReactNode, useLayoutEffect, useRef } from "react";
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

const TimelapsContent = forwardRef<HTMLDivElement>(function TimelapsContent(_, ref) {
  return (
    <div ref={ref} className={styles.layout}>
      <Typography.h1 className={styles.title}>{CONTENT.title}</Typography.h1>
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

  return <TimelapsContent ref={ref} />;
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

  return <TimelapsContent ref={timelapsRef} />;
}