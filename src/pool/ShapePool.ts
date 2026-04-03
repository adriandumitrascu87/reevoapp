import { Sprite, Texture } from "pixi.js";
import { SETTINGS } from "../settings/settings";
import { FallingShape } from "../objects/FallingShape";

export class ShapePool {
  private pool: FallingShape[] = [];

  constructor() {
    // this.createPool();
  }

  // createPool() {

  // }

  public get(): FallingShape {
    return this.pool.pop() ?? new FallingShape();
  }

  public release(shape: FallingShape): void {
    this.pool.push(shape);
  }

  public get size(): number {
    return this.pool.length;
  }
}
