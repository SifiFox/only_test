import type { SlideCategory } from "@/entities";
import { useMemo } from "react";

interface UseYearRangeParams {
  activeSlide?: SlideCategory;
}

export function useYearRange({ activeSlide }: UseYearRangeParams): { dateFrom: string; dateTo: string } {
  return useMemo(() => {
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
}
