interface CarouselCounterProps {
  value: string;
  total: string;
  className?: string;
}

export function CarouselCounter({
  value,
  total,
  className,
}: CarouselCounterProps) {
  return <span className={className}>{value}/{total}</span>;
}
