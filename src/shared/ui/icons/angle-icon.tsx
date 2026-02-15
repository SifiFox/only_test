import { cn } from "@/shared";

interface AngleIconProps {
  direction: "left" | "right";
  className?: string;
  rightClassName?: string;
}

export function AngleIcon({
  direction,
  className,
  rightClassName,
}: AngleIconProps) {
  return (
    <svg
      viewBox="0 0 9 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className, direction === "right" && rightClassName)}
      aria-hidden
    >
      <path
        d="M7.66418 0.707108L1.41419 6.95711L7.66418 13.2071"
        strokeWidth="2"
      />
    </svg>
  );
}
