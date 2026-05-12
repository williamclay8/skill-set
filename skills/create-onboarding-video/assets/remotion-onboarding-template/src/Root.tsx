import React from "react";
import {Composition, registerRoot} from "remotion";
import {DemoFlow} from "./scenes/DemoFlow";
import {DURATION_IN_FRAMES, FPS, HEIGHT, WIDTH} from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="OnboardingPreview"
      component={DemoFlow}
      durationInFrames={DURATION_IN_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{
        width: WIDTH,
        height: HEIGHT,
      }}
    />
  );
};

registerRoot(RemotionRoot);
