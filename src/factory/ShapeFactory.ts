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

    if(this.cache.length==0){
        this.generateCache();
    }
    return this.cache[Math.floor(Math.random() * this.cache.length)];
  }

  private static getRandomDrawingFn(): (g: Graphics, size: number) => void {
    const fn = [(g: Graphics, size: number) => this.drawCircle(g, size)];

    return fn[Math.floor(Math.random() * fn.length)];
  }

  private static drawCircle(graphics: Graphics, size: number) {
    graphics.circle(0, 0, size / 2);
  }

  //toDo - to use

  private static destroyCache() {
    this.cache.forEach((t) => t.destroy());
    this.cache = [];
  }
}
