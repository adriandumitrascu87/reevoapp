import { Graphics, Texture } from "pixi.js";
import { app } from "../app";
import { SETTINGS } from "../settings/settings";

export function createIrregularTexture(): Texture {
  const graphics = new Graphics();
  const sides = 5 + Math.floor(Math.random() * 5);
  const size = SETTINGS.shapeMinSize + Math.random() * (SETTINGS.shapeMaxSize-SETTINGS.shapeMinSize);
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
