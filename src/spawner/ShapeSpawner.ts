import { Container, Ticker } from "pixi.js";
import { ShapePool } from "../pool/ShapePool";
import { app } from "../app";
import { getCanvasSize } from "../utils/screen";
import { ShapeFactory } from "../factory/ShapeFactory";
import { SETTINGS } from "../settings/settings";
import { FallingShape } from "../objects/FallingShape";

export class ShapeSpawner {
  container: Container;
  pool: ShapePool;
  elapsed: number = 0;
  activeShapes: FallingShape[] = [];

  constructor(container: Container) {
    this.container = container;
    this.pool = new ShapePool();
    app.ticker.add(this.update);
  }

  update = (ticker: Ticker) => {
    this.elapsed += ticker.deltaMS;
    if (this.elapsed >= SETTINGS.spawnIntervalMS) {
      this.spawnShape();
      this.elapsed = 0;
    }

    this.moveShape();
  };

  spawnShape() {
    const sprite = this.pool.get();
    const shape = new FallingShape(sprite, this.container);
    shape.spawn();
    this.activeShapes.push(shape);
  }

  moveShape() {
    for (let i = this.activeShapes.length - 1; i >= 0; i--) {
      const fallingShape = this.activeShapes[i];
      const outOfContainer = fallingShape.update();
      if (outOfContainer) {
        this.pool.release(fallingShape.sprite);
        this.activeShapes.splice(i, 1);
      }
    }
  }

  //To do -> use it
  public destroy() {
    app.ticker.remove(this.update);
    // this.activeShapes.forEach todo
    this.activeShapes = [];
  }
}
