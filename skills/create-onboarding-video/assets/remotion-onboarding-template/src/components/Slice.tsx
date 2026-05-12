import React from "react";
import {staticFile} from "remotion";
import {COLORS} from "../theme";

type Crop = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type SliceProps = {
  src: string;
  crop: Crop;
  sourceWidth: number;
  sourceHeight: number;
  width: number;
  radius?: number;
  shadow?: boolean;
  style?: React.CSSProperties;
};

export const Slice: React.FC<SliceProps> = ({
  src,
  crop,
  sourceWidth,
  sourceHeight,
  width,
  radius = 44,
  shadow = true,
  style,
}) => {
  const scale = width / crop.width;
  const height = crop.height * scale;

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        overflow: "hidden",
        borderRadius: radius,
        background: COLORS.surface,
        boxShadow: shadow ? `0 34px 90px ${COLORS.shadow}` : undefined,
        ...style,
      }}
    >
      <img
        src={staticFile(src)}
        style={{
          position: "absolute",
          left: -crop.x * scale,
          top: -crop.y * scale,
          width: sourceWidth * scale,
          height: sourceHeight * scale,
        }}
      />
    </div>
  );
};
