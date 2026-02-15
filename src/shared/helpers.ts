import { TimelapsAnimationResult } from "@/shared";

export function parseYear(value: string): number | null {
  const parsedValue = Number.parseInt(value, 10);
  return Number.isFinite(parsedValue) ? parsedValue : null;
}

export function getInitialIsMobile(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(max-width: 767px)").matches;
}

export function formatCounterValue(value: number): string {
  return String(value).padStart(2, "0");
}

export function getAnimationCleanup(animationResult: TimelapsAnimationResult): (() => void) | null {
  if (typeof animationResult === "function") {
    return animationResult;
  }

  if (animationResult && "kill" in animationResult) {
    return () => animationResult.kill();
  }

  return null;
}
