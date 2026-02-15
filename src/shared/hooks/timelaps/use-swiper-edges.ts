import { useCallback, useState } from "react";
import type { Swiper as SwiperType } from "swiper";

interface UseSwiperEdgesResult {
  isInnerAtStart: boolean;
  isInnerAtEnd: boolean;
  updateInnerEdges: (swiper: SwiperType) => void;
}

export function useSwiperEdges(): UseSwiperEdgesResult {
  const [isInnerAtStart, setIsInnerAtStart] = useState(true);
  const [isInnerAtEnd, setIsInnerAtEnd] = useState(false);

  const updateInnerEdges = useCallback((swiper: SwiperType) => {
    setIsInnerAtStart(swiper.isBeginning);
    setIsInnerAtEnd(swiper.isEnd);
  }, []);

  return { isInnerAtStart, isInnerAtEnd, updateInnerEdges };
}
