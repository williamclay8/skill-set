export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const DURATION_IN_FRAMES = 450;
export const CAPTION_BAND = 260;
export const FONT =
  "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";

export const COLORS = {
  background: "#F5F7FA",
  surface: "#FFFFFF",
  ink: "#172033",
  muted: "#64748B",
  accent: "#2F80ED",
  accentSoft: "#DDEBFF",
  success: "#20B486",
  shadow: "rgba(23, 32, 51, 0.18)",
};

export const easeOut = [0.16, 1, 0.3, 1] as const;

export const seconds = (value: number) => Math.round(value * FPS);
