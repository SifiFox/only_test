export const CAROUSEL_START_ANGLE_DEG = -90;
export const CAROUSEL_ACTIVE_ANCHOR_ANGLE_DEG = -60;

export function getStepAngle(totalPoints: number): number {
  if (totalPoints <= 0) {
    return 0;
  }

  return 360 / totalPoints;
}

export function getPointBaseAngle({
  index,
  totalPoints,
}: {
  index: number;
  totalPoints: number;
}): number {
  return CAROUSEL_START_ANGLE_DEG + getStepAngle(totalPoints) * index;
}

export function normalizeAngle(angleDeg: number): number {
  const normalized = ((angleDeg + 180) % 360 + 360) % 360 - 180;
  return normalized === -180 ? 180 : normalized;
}

export function getShortestAngleDelta({
  fromDeg,
  toDeg,
}: {
  fromDeg: number;
  toDeg: number;
}): number {
  return normalizeAngle(toDeg - fromDeg);
}

export function getTargetRotationForActiveIndex({
  activeIndex,
  totalPoints,
}: {
  activeIndex: number;
  totalPoints: number;
}): number {
  return CAROUSEL_ACTIVE_ANCHOR_ANGLE_DEG - getPointBaseAngle({ index: activeIndex, totalPoints });
}

export function getNextRotationByShortestPath({
  currentRotationDeg,
  targetRotationDeg,
}: {
  currentRotationDeg: number;
  targetRotationDeg: number;
}): number {
  const delta = getShortestAngleDelta({
    fromDeg: currentRotationDeg,
    toDeg: targetRotationDeg,
  });

  return currentRotationDeg + delta;
}
