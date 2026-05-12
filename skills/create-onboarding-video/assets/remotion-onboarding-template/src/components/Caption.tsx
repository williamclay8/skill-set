import React from "react";
import {
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {CAPTION_BAND, COLORS, FONT, easeOut} from "../theme";

type TopCaptionProps = {
  children: React.ReactNode;
  staticEntry?: boolean;
};

export const TopCaption: React.FC<TopCaptionProps> = ({
  children,
  staticEntry = false,
}) => {
  const frame = useCurrentFrame();
  const {width} = useVideoConfig();
  const entry = staticEntry
    ? 1
    : interpolate(frame, [4, 16], [0, 1], {
        easing: Easing.bezier(...easeOut),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

  return (
    <div
      style={{
        position: "absolute",
        top: 88,
        left: 0,
        width,
        height: CAPTION_BAND,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      <div
        style={{
          maxWidth: Math.min(820, width - 120),
          color: COLORS.ink,
          fontFamily: FONT,
          fontSize: 54,
          fontWeight: 760,
          lineHeight: 1.08,
          textAlign: "center",
          opacity: entry,
          transform: `translateY(${(1 - entry) * 60}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};
