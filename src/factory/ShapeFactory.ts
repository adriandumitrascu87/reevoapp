import { Graphics, Sprite, Texture } from "pixi.js";
import { ShapeConfig } from "../types/shape";
import { app } from "../app";
import { SETTINGS } from "../settings/settings";

export class ShapeFactory {
  private static cache: Texture[] = [];
  public static create(config: ShapeConfig): Texture {
    const graphics = new Graphics();
    const shapeDrawingFn = this.getRandomDrawingFn();

    // const padding = config.size;
    // graphics.position.set(padding,padding)

    shapeDrawingFn(graphics, config.size);
    graphics.fill(config.color);

    const texture = app.renderer.generateTexture(graphics);

    graphics.destroy();

    return texture;
  }

  public static generateCache() {
    for (let i = 0; i < SETTINGS.shapeCacheSize; i++) {
      this.cache.push(
        this.create({
          color: Math.floor(Math.random() * 0xffffff),
          size: 100 + Math.random() * 100,
        }),
      );
    }
  }
  public static getRandomTexture(): Texture {
    if (this.cache.length == 0) {
      this.generateCache();
    }
    return this.cache[Math.floor(Math.random() * this.cache.length)];
  }

  private static getRandomDrawingFn(): (g: Graphics, size: number) => void {
    const fn = [
      (g: Graphics, size: number) => this.drawCircle(g, size),
      (g: Graphics, size: number) => this.drawEllipse(g, size),
      (g: Graphics, size: number) => this.drawRegularPolygon(g, size, 3),
      (g: Graphics, size: number) => this.drawRegularPolygon(g, size, 4),
      (g: Graphics, size: number) => this.drawRegularPolygon(g, size, 5),
      (g: Graphics, size: number) => this.drawRegularPolygon(g, size, 6),
      (g: Graphics, size: number) => this.drawStar(g, size),
    ];

    return fn[Math.floor(Math.random() * fn.length)];
  }

  private static drawRegularPolygon(g: Graphics, size: number, sides: number): void {
    const points: number[] = [];
    for (let i = 0; i < sides; i++) {
      // const orientation = Math.random()>0.5? Math.PI / 2 : -Math.PI / 2;
      const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
      points.push(Math.cos(angle) * size, Math.sin(angle) * size);
    }
    g.poly(points);
  }

  private static drawCircle(graphics: Graphics, size: number) {
    graphics.circle(0, 0, size / 2);
  }

  private static drawEllipse(g: Graphics, size: number): void {
    g.ellipse(0, 0, size, size * 0.5);
  }

  private static drawStar(g: Graphics, size: number): void {
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

  //toDo - to use

  private static destroyCache() {
    this.cache.forEach((t) => t.destroy());
    this.cache = [];
  }
}
