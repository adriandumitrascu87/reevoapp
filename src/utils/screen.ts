import { app } from "../app";
import { SETTINGS } from "../settings/settings";

/**
 * screen utility functions — all sizes are derived from app.screen
 */
export function getPadding(): { x: number; y: number } {
  return {
    x: app.screen.width * SETTINGS.padding.horizontal,
    y: app.screen.height * SETTINGS.padding.vertical,
  };
}

export function getCanvasSize(): { width: number; height: number } {
  const padding = getPadding();

  return {
    width: app.screen.width - padding.x * 2,
    height: app.screen.height - padding.y * 2,
  };
}

export function getCanvasPosition(): { x: number; y: number } {
  const { width, height } = getCanvasSize();

  return {
    x: (app.screen.width - width) / 2,
    y: (app.screen.height - height) / 2,
  };
}
