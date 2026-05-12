import {interpolate} from "remotion";

export const crossfade = (
  frame: number,
  start: number,
  duration: number,
): number => {
  return interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};
