import { cn } from "@/shared";
import type { SlideCategory } from "@/entities";

interface CarouselDotsProps {
  slides: SlideCategory[];
  activeIndex: number;
  onSelect: (slideId: number) => void;
  className?: string;
  dotClassName?: string;
  activeDotClassName?: string;
}

export function CarouselDots({
  slides,
  activeIndex,
  onSelect,
  className,
  dotClassName,
  activeDotClassName,
}: CarouselDotsProps) {
  return (
    <div className={className} role="tablist" aria-label="Навигация по внешним слайдам">
      {slides.map((slide, index) => {
        const isActiveDot = index === activeIndex;

        return (
          <button
            key={slide.id}
            type="button"
            role="tab"
            aria-selected={isActiveDot}
            aria-label={`Перейти к внешнему слайду ${index + 1}`}
            className={cn(dotClassName, isActiveDot && activeDotClassName)}
            onClick={() => onSelect(slide.id)}
          />
        );
      })}
    </div>
  );
}
