import { parseYear } from "@/shared";
import { animateYearCounter } from "@/shared";
import { useEffect, useRef, useState } from "react";

interface UseAnimatedYearRangeParams {
  dateFrom: string;
  dateTo: string;
}

function useAnimatedYear({
  value,
}: {
  value: string;
}): string {
  const [animatedValue, setAnimatedValue] = useState(value);
  const tweenRef = useRef<ReturnType<typeof animateYearCounter> | null>(null);
  const animatedNumberRef = useRef<number>(parseYear(value) ?? 0);

  useEffect(() => {
    const targetValue = parseYear(value);
    if (targetValue === null) {
      tweenRef.current?.kill();
      setAnimatedValue(value);
      return;
    }

    if (animatedNumberRef.current === targetValue) {
      setAnimatedValue(String(targetValue));
      return;
    }

    tweenRef.current?.kill();
    tweenRef.current = animateYearCounter({
      from: animatedNumberRef.current,
      to: targetValue,
      onUpdate: (nextYear) => {
        animatedNumberRef.current = nextYear;
        setAnimatedValue(String(nextYear));
      },
      onComplete: () => {
        animatedNumberRef.current = targetValue;
        setAnimatedValue(String(targetValue));
      },
    });
  }, [value]);

  useEffect(() => {
    return () => {
      tweenRef.current?.kill();
    };
  }, []);

  return animatedValue;
}

export function useAnimatedYearRange({
  dateFrom,
  dateTo,
}: UseAnimatedYearRangeParams): {
  animatedDateFrom: string;
  animatedDateTo: string;
} {
  const animatedDateFrom = useAnimatedYear({ value: dateFrom });
  const animatedDateTo = useAnimatedYear({ value: dateTo });

  return { animatedDateFrom, animatedDateTo };
}
