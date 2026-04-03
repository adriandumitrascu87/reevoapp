import { Graphics, Sprite, Texture } from "pixi.js";
import { ShapeConfig } from "../types/shape";
import { app } from "../app";
import { SETTINGS } from "../settings/settings";
import { drawCircle, drawEllipse, drawRegularPolygon, drawStar } from "../utils/shapesTexture";

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
          size: SETTINGS.shapeMinSize + Math.random() * (SETTINGS.shapeMaxSize-SETTINGS.shapeMinSize),
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
      (g: Graphics, size: number) => drawCircle(g, size),
      (g: Graphics, size: number) => drawEllipse(g, size),
      (g: Graphics, size: number) => drawRegularPolygon(g, size, 3),
      (g: Graphics, size: number) => drawRegularPolygon(g, size, 4),
      (g: Graphics, size: number) => drawRegularPolygon(g, size, 5),
      (g: Graphics, size: number) => drawRegularPolygon(g, size, 6),
      (g: Graphics, size: number) => drawStar(g, size),
    ];

    return fn[Math.floor(Math.random() * fn.length)];
  }



  //toDo - to use

  private static destroyCache() {
    this.cache.forEach((t) => t.destroy());
    this.cache = [];
  }
}
