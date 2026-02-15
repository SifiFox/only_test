import { RefObject } from "react";

export type TimelapsAnimationResult =
  | void
  | (() => void)
  | { kill: () => void };

export type TimelapsAnimation = (params: {
  timelapsRef: RefObject<HTMLDivElement | null>;
}) => TimelapsAnimationResult;
