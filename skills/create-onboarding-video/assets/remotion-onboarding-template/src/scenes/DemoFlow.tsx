import React from "react";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {TopCaption} from "../components/Caption";
import {GlowRing, Pointer, TapDot} from "../components/Cursor";
import {Slice} from "../components/Slice";
import {
  CAPTION_BAND,
  COLORS,
  DURATION_IN_FRAMES,
  FONT,
  easeOut,
  seconds,
} from "../theme";
import {crossfade} from "../transitions/crossfade";

type DemoFlowProps = {
  width?: number;
  height?: number;
};

const STILL = {
  sourceWidth: 1080,
  sourceHeight: 1920,
  inputCrop: {x: 120, y: 520, width: 840, height: 430},
  resultCrop: {x: 120, y: 620, width: 840, height: 610},
};

const stageStyle: React.CSSProperties = {
  alignItems: "center",
  justifyContent: "center",
  paddingTop: CAPTION_BAND,
  fontFamily: FONT,
};

const RestingBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const tapAt = seconds(1.35);
  const sliceWidth = 830;
  const sliceHeight = (STILL.inputCrop.height * sliceWidth) / STILL.inputCrop.width;
  const startX = sliceWidth / 2;
  const startY = sliceHeight / 2;
  const targetX = 660;
  const targetY = 306;
  const fadeIn = interpolate(frame, [8, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [tapAt + 12, tapAt + 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const move = interpolate(frame, [18, tapAt], [0, 1], {
    easing: Easing.bezier(...easeOut),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cardScale = spring({
    frame,
    fps,
    config: {damping: 22, stiffness: 140},
    durationInFrames: 36,
  });
  const pointerX = interpolate(move, [0, 1], [startX, targetX]);
  const pointerY = interpolate(move, [0, 1], [startY, targetY]);

  return (
    <AbsoluteFill style={{...stageStyle, background: COLORS.background}}>
      <TopCaption>Tap the action that proves the feature</TopCaption>
      <div
        style={{
          position: "relative",
          transform: `translateY(30px) scale(${0.94 + cardScale * 0.06})`,
        }}
      >
        <Slice
          src="demo/resting.svg"
          crop={STILL.inputCrop}
          sourceWidth={STILL.sourceWidth}
          sourceHeight={STILL.sourceHeight}
          width={sliceWidth}
        />
        <GlowRing
          x={560}
          y={220}
          width={220}
          height={96}
          startAt={26}
          radius={48}
        />
        <Pointer
          x={pointerX}
          y={pointerY}
          opacity={fadeIn * (1 - fadeOut)}
        />
        <TapDot tapAt={tapAt} x={targetX} y={targetY} />
      </div>
    </AbsoluteFill>
  );
};

const ResultBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const settle = spring({
    frame,
    fps,
    config: {damping: 18, stiffness: 120},
    durationInFrames: 42,
  });
  const reveal = interpolate(frame, [10, 42], [0, 1], {
    easing: Easing.bezier(...easeOut),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{...stageStyle, background: COLORS.background}}>
      <TopCaption>The result lands as a focused slice</TopCaption>
      <div
        style={{
          position: "relative",
          transform: `translateY(${60 - settle * 60}px) scale(${
            0.96 + settle * 0.04
          })`,
          opacity: reveal,
        }}
      >
        <Slice
          src="demo/result.svg"
          crop={STILL.resultCrop}
          sourceWidth={STILL.sourceWidth}
          sourceHeight={STILL.sourceHeight}
          width={830}
          radius={48}
        />
        <GlowRing
          x={52}
          y={342}
          width={726}
          height={126}
          startAt={32}
          color="rgba(32, 180, 134, 0.78)"
          radius={42}
        />
      </div>
    </AbsoluteFill>
  );
};

export const DemoFlow: React.FC<DemoFlowProps> = () => {
  const frame = useCurrentFrame();
  const fadeToResult = crossfade(frame, 76, 20);

  return (
    <AbsoluteFill>
      <Sequence durationInFrames={96}>
        <div style={{opacity: 1 - fadeToResult}}>
          <RestingBeat />
        </div>
      </Sequence>
      <Sequence from={76} durationInFrames={DURATION_IN_FRAMES - 76}>
        <div style={{opacity: fadeToResult}}>
          <ResultBeat />
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
