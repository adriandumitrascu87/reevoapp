import { Sprite, Texture } from "pixi.js";
import { SETTINGS } from "../settings/settings";

export class ShapePool {
  private pool: Sprite[] = [];

  constructor() {
    this.createPool();
  }

  createPool() {
    for (let i = 0; i < SETTINGS.poolSize.initialSize; i++) {
      this.pool.push(this.createShape());
    }
  }

  createShape(): Sprite {
    const s = new Sprite();
    s.visible = false;
    s.anchor.set(0.5, 0.5);

    return s;
  }

  public get(): Sprite {
    if (this.pool.length > 0) {
      return this.pool.pop()!;
    }

    const sprite = this.createShape();
    return sprite;
  }

  public release(sprite: Sprite) {
    sprite.texture = Texture.EMPTY;
    sprite.visible = false;
    sprite.x = 0;
    sprite.y = 0;
    sprite.rotation = 0;
    sprite.alpha = 1;
    this.pool.push(sprite);
  }

  public get size(): number {
    return this.pool.length;
  }
}
