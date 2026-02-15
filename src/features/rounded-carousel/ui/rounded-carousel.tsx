import type { SlideCategory } from "@/entities";
import { useRoundedCarousel } from "@/features";
import { cn } from "@/shared";
import { type CSSProperties, useEffect } from "react";
import styles from "./rounded-carousel.module.scss";

interface RoundedCarouselProps {
  slides: SlideCategory[];
  activeId?: number;
  defaultActiveId?: number;
  onActiveChange?: (id: number) => void;
  onSettledChange?: (isSettled: boolean) => void;
  className?: string;
  children?: React.ReactNode;
}

type PointStyle = CSSProperties & {
  "--point-angle": string;
};

export function RoundedCarousel({
  slides,
  activeId,
  defaultActiveId,
  onActiveChange,
  onSettledChange,
  className,
  children,
}: RoundedCarouselProps) {
  const { isReadyToRender, safeActiveId, isSettled, pointsLayerRef, points, handlePointsLayerClick } =
    useRoundedCarousel({
      slides,
      activeId,
      defaultActiveId,
      onActiveChange,
    });

  useEffect(() => {
    onSettledChange?.(isSettled);
  }, [isSettled, onSettledChange]);

  if (!isReadyToRender || safeActiveId === null) {
    return null;
  }

  return (
    <div className={cn(styles.root, className)}>
      <div className={styles.circle} />
      <div
        ref={pointsLayerRef}
        className={styles.pointsLayer}
        onClick={handlePointsLayerClick}
      >
        {points.map(({ slide, index, baseAngleDeg }) => {
          const isActive = slide.id === safeActiveId;
          const pointStyle: PointStyle = { "--point-angle": `${baseAngleDeg}deg` };

          return (
            <div key={slide.id} className={styles.point} style={pointStyle}>
              <div className={styles.pointContent}>
                <button
                  type="button"
                  className={cn(styles.pointButton, isActive && styles.pointButtonActive)}
                  data-slide-id={slide.id}
                  data-slide-index={index}
                  aria-label={`Слайд ${index + 1}: ${slide.title}`}
                >
                  <span className={styles.pointIndex}>{index + 1}</span>
                </button>
                {isActive && isSettled ? <span className={styles.activeTitle}>{slide.title}</span> : null}
              </div>
            </div>
          );
        })}
      </div>
      {children}
    </div>
  );
}