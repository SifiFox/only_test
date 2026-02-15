import type { SlideCategory } from "@/entities";
import {
  AngleIcon, Typography, formatCounterValue, cn, useCarouselTransition,
  useSwiperEdges,
} from "@/shared";
import { useId } from "react";
import { FreeMode, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";

import styles from "./timelaps-carousel.module.scss";
import { CarouselCounter } from "./carousel-counter";
import { CarouselNavigation } from "./carousel-navigation";
import { CarouselDots } from "./carousel-dots";

interface TimelapsCarouselProps {
  slides: SlideCategory[];
  activeSlideId: number;
  onActiveChange: (slideId: number) => void;
  isOuterSettled: boolean;
  isMobile: boolean;
}

export function TimelapsCarousel({
  slides,
  activeSlideId,
  onActiveChange,
  isOuterSettled,
  isMobile,
}: TimelapsCarouselProps) {
  const activeSlideIndex = slides.findIndex((slide) => slide.id === activeSlideId);
  const safeActiveSlideIndex = activeSlideIndex < 0 ? 0 : activeSlideIndex;
  const totalSlidesCount = slides.length;
  const activeCounterValue = formatCounterValue(safeActiveSlideIndex + 1);
  const totalCounterValue = formatCounterValue(totalSlidesCount);

  const { displayedSlideId, innerContentRef } = useCarouselTransition({
    activeSlideId,
    isMobile,
    isOuterSettled,
  });
  const displayedSlideIndex = slides.findIndex((slide) => slide.id === displayedSlideId);
  const safeDisplayedSlideIndex = displayedSlideIndex < 0 ? safeActiveSlideIndex : displayedSlideIndex;
  const displayedSlide = slides[safeDisplayedSlideIndex];
  const dates = displayedSlide?.dates ?? [];
  const isOuterAtStart = safeActiveSlideIndex <= 0;
  const isOuterAtEnd = safeActiveSlideIndex >= totalSlidesCount - 1;

  const carouselId = useId().replace(/:/g, "");
  const innerPrevClassName = `timelaps-inner-prev-${carouselId}`;
  const innerNextClassName = `timelaps-inner-next-${carouselId}`;
  const innerSwiperKey = `inner-swiper-${displayedSlide?.id ?? "empty"}`;
  const modules = isMobile ? [FreeMode] : [Navigation];

  const { isInnerAtStart, isInnerAtEnd, updateInnerEdges } = useSwiperEdges();

  function handleOuterPrev(): void {
    if (!totalSlidesCount || isOuterAtStart) {
      return;
    }
    const previousSlideIndex = safeActiveSlideIndex - 1;
    onActiveChange(slides[previousSlideIndex].id);
  }

  function handleOuterNext(): void {
    if (!totalSlidesCount || isOuterAtEnd) {
      return;
    }
    const nextSlideIndex = safeActiveSlideIndex + 1;
    onActiveChange(slides[nextSlideIndex].id);
  }

  return (
    <div className={styles.root}>
      {!isMobile ? (
        <div className={styles.outerControls}>
          <CarouselCounter
            value={activeCounterValue}
            total={totalCounterValue}
            className={styles.outerCounter}
          />
          <CarouselNavigation
            onPrev={handleOuterPrev}
            onNext={handleOuterNext}
            isPrevDisabled={isOuterAtStart}
            isNextDisabled={isOuterAtEnd}
            prevLabel="Предыдущий слайд внешней карусели"
            nextLabel="Следующий слайд внешней карусели"
            wrapperClassName={styles.outerNavigation}
            buttonClassName={styles.navButton}
            prevButtonClassName={styles.navButtonPrev}
            nextButtonClassName={styles.navButtonNext}
            iconWrapperClassName={styles.navIcon}
            iconClassName={styles.navIconImage}
            rightIconClassName={styles.navIconImageRight}
          />
        </div>
      ) : null}

      <div className={styles.innerCarousel}>
        <div ref={innerContentRef}>
          {isMobile ? (
            <div className={styles.sliderHeader}>
              <Typography.h3 className={styles.sliderHeaderTitle}>{displayedSlide?.title}</Typography.h3>
              <div className={styles.sliderHeaderLine} />
            </div>
          ) : null}

          <div className={styles.innerSwiperShell}>
            {!isMobile ? (
              <>
                <button
                  type="button"
                  className={cn(
                    styles.navButton,
                    styles.navButtonPrev,
                    styles.innerEdgeNav,
                    styles.innerEdgeNavPrev,
                    innerPrevClassName,
                    isInnerAtStart && styles.innerEdgeNavHidden,
                  )}
                  disabled={isInnerAtStart}
                  aria-label="Предыдущий слайд внутренней карусели"
                >
                  <span className={styles.navIcon} aria-hidden="true">
                    <AngleIcon direction="left" className={styles.navIconImage} rightClassName={styles.navIconImageRight} />
                  </span>
                </button>
                <button
                  type="button"
                  className={cn(
                    styles.navButton,
                    styles.navButtonNext,
                    styles.innerEdgeNav,
                    styles.innerEdgeNavNext,
                    innerNextClassName,
                    isInnerAtEnd && styles.innerEdgeNavHidden,
                  )}
                  disabled={isInnerAtEnd}
                  aria-label="Следующий слайд внутренней карусели"
                >
                  <span className={styles.navIcon} aria-hidden="true">
                    <AngleIcon direction="right" className={styles.navIconImage} rightClassName={styles.navIconImageRight} />
                  </span>
                </button>
              </>
            ) : null}

            <Swiper
              key={innerSwiperKey}
              modules={modules}
              className={styles.innerSwiper}
              navigation={
                !isMobile
                  ? {
                    prevEl: `.${innerPrevClassName}`,
                    nextEl: `.${innerNextClassName}`,
                  }
                  : false
              }
              pagination={false}
              freeMode={isMobile}
              onSwiper={updateInnerEdges}
              onSlideChange={updateInnerEdges}
              slidesPerView={1.5}
              spaceBetween={20}
              breakpoints={{
                768: {
                  slidesPerView: 3,
                  spaceBetween: 32,
                },
              }}

            >
              {dates.map((date, dateIndex) => (
                <SwiperSlide key={`${date.year}-${date.title}-${dateIndex}`} className={styles.innerSlide}>
                  <article className={styles.dateCard}>
                    <Typography.span className={styles.dateYear}>{date.year}</Typography.span>
                    <Typography.p className={styles.dateTitle}>{date.title}</Typography.p>
                  </article>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {isMobile ? (
          <div className={styles.mobileFooter}>
            <div className={styles.mobileOuterControls}>
              <CarouselCounter
                value={activeCounterValue}
                total={totalCounterValue}
                className={styles.outerCounter}
              />
              <CarouselNavigation
                onPrev={handleOuterPrev}
                onNext={handleOuterNext}
                isPrevDisabled={isOuterAtStart}
                isNextDisabled={isOuterAtEnd}
                prevLabel="Предыдущий слайд внешней карусели"
                nextLabel="Следующий слайд внешней карусели"
                wrapperClassName={styles.outerNavigation}
                buttonClassName={styles.navButton}
                prevButtonClassName={styles.navButtonPrev}
                nextButtonClassName={styles.navButtonNext}
                iconWrapperClassName={styles.navIcon}
                iconClassName={styles.navIconImage}
                rightIconClassName={styles.navIconImageRight}
              />
            </div>

            <CarouselDots
              slides={slides}
              activeIndex={safeActiveSlideIndex}
              onSelect={onActiveChange}
              className={styles.outerDots}
              dotClassName={styles.outerDot}
              activeDotClassName={styles.outerDotActive}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
