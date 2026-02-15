import { cn } from "@/shared/lib";
import styles from "./skeleton.module.scss";

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className, style }: SkeletonProps) {
  return <span className={cn(styles.skeleton, className)} style={style} aria-hidden />;
}
