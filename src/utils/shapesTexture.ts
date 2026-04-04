import { Graphics, Texture } from "pixi.js";
import { app } from "../app";
import { SETTINGS } from "../settings/settings";
import { getCanvasSize } from "./screen";

/**
 * Shape drawing utilities and texture generation.
 */

// generates a unique irregular shape texture at click position
// not cached, intended for one-off click spawns
export function createIrregularTexture(): Texture {

  const {width} = getCanvasSize();
  const graphics = new Graphics();
  const sides = 5 + Math.floor(Math.random() * 5);

  const minSize = SETTINGS.shapeMinSize/100 * width;
  const maxSize = SETTINGS.shapeMaxSize/100 * width;

  const size = minSize + Math.random() *(maxSize-minSize);
  const color = Math.floor(Math.random() * 0xffffff);
  const points: number[] = [];

  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
    const radius = size * (0.5 + Math.random() * 0.5);
    points.push(Math.cos(angle) * radius, Math.sin(angle) * radius);
  }

  graphics.poly(points);
  graphics.fill(color);

  const texture = app.renderer.generateTexture(graphics);
  graphics.destroy();

  return texture;
}
// draws a regular polygon centered at 0,0
// starts at top (-PI/2 offset)
export function drawRegularPolygon(
  g: Graphics,
  size: number,
  sides: number,
): void {
  const points: number[] = [];
  for (let i = 0; i < sides; i++) {
    // const orientation = Math.random()>0.5? Math.PI / 2 : -Math.PI / 2;
    const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
    points.push(Math.cos(angle) * size, Math.sin(angle) * size);
  }
  g.poly(points);
}

export function drawCircle(graphics: Graphics, size: number) {
  graphics.circle(0, 0, size / 2);
}

export function drawEllipse(g: Graphics, size: number): void {
  g.ellipse(0, 0, size, size * 0.5);
}
// draws a 5-point star
export function drawStar(g: Graphics, size: number): void {
  const points: number[] = [];
  const outerRadius = size;
  const innerRadius = size * 0.4;

  for (let i = 0; i < 10; i++) {
    const angle = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    points.push(Math.cos(angle) * radius, Math.sin(angle) * radius);
  }
  g.poly(points);

}
