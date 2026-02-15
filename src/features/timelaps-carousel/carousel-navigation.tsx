import { cn, AngleIcon } from "@/shared";

interface CarouselNavigationProps {
  onPrev?: () => void;
  onNext?: () => void;
  isPrevDisabled?: boolean;
  isNextDisabled?: boolean;
  prevLabel: string;
  nextLabel: string;
  wrapperClassName?: string;
  buttonClassName?: string;
  prevButtonClassName?: string;
  nextButtonClassName?: string;
  iconWrapperClassName?: string;
  iconClassName?: string;
  rightIconClassName?: string;
}

export function CarouselNavigation({
  onPrev,
  onNext,
  isPrevDisabled = false,
  isNextDisabled = false,
  prevLabel,
  nextLabel,
  wrapperClassName,
  buttonClassName,
  prevButtonClassName,
  nextButtonClassName,
  iconWrapperClassName,
  iconClassName,
  rightIconClassName,
}: CarouselNavigationProps) {
  const handlePrev = onPrev ?? (() => undefined);
  const handleNext = onNext ?? (() => undefined);

  return (
    <div className={wrapperClassName}>
      <button
        type="button"
        className={cn(buttonClassName, prevButtonClassName)}
        onClick={handlePrev}
        disabled={isPrevDisabled}
        aria-label={prevLabel}
      >
        <span className={iconWrapperClassName} aria-hidden="true">
          <AngleIcon direction="left" className={iconClassName} rightClassName={rightIconClassName} />
        </span>
      </button>
      <button
        type="button"
        className={cn(buttonClassName, nextButtonClassName)}
        onClick={handleNext}
        disabled={isNextDisabled}
        aria-label={nextLabel}
      >
        <span className={iconWrapperClassName} aria-hidden="true">
          <AngleIcon direction="right" className={iconClassName} rightClassName={rightIconClassName} />
        </span>
      </button>
    </div>
  );
}
