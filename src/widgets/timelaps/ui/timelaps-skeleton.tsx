import styles from "../timelaps-skeleton.module.scss";

export function TimelapsSkeleton() {
  return (
    <div className={styles.layout}>
      <div className={styles.content}>
        <div className={styles.desktopSkeleton}>
          <div className={styles.titleWrap}>
            <div className={styles.titleLine} />
          </div>

          <div className={styles.carousel_content} aria-hidden>
            <div className={styles.carouselNumber} />
          </div>

          <div className={styles.carouselBlock}>
            <div className={styles.controlsRow}>
              <div className={styles.counterLine} />
              <div className={styles.navCircle} />
              <div className={styles.navCircle} />
            </div>
            <div className={styles.sliderHeader}>
              <div className={styles.headerTitle} />
              <div className={styles.headerLine} />
            </div>
            <div className={styles.cardsRow}>
              <div className={styles.card} />
              <div className={styles.card} />
              <div className={styles.card} />
            </div>
          </div>
        </div>

        <div className={styles.mobileSkeleton} aria-hidden>
          <div className={styles.mStrip} />
          <div className={styles.mTwoStrips}>
            <div className={styles.mStrip} />
            <div className={styles.mStrip} />
          </div>
          <div className={styles.mStrip} />
          <div className={styles.mTwoBlocks}>
            <div className={styles.mBlock} />
            <div className={styles.mBlock} />
          </div>
          <div className={styles.mTwoBlocks}>
            <div className={styles.mBlock} />
            <div className={styles.mBlock} />
          </div>
        </div>
      </div>
    </div>
  );
}
