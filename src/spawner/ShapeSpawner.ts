import { Container, Ticker } from "pixi.js";
import { ShapePool } from "../pool/ShapePool";
import { app } from "../app";
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
    this.populatePool();
    app.ticker.add(this.update);
  }

  populatePool() {
    for (let i = 0; i < SETTINGS.poolSize.initialSize; i++) {
      this.pool.release(this.createShape());
    }
  }

  private createShape(): FallingShape {
    const shape = new FallingShape();
    shape.on("shapeClicked", this.onShapeClicked);
    return shape;
  }

  private onShapeClicked = (shape: FallingShape): void => {
    this.releaseShape(shape, this.activeShapes.indexOf(shape));
  };

  private releaseShape(shape: FallingShape, index: number): void {
    if (index === -1) return;
    shape.reset();
    this.container.removeChild(shape);
    this.activeShapes.splice(index, 1);
    this.pool.release(shape);
  }

  private getShape(): FallingShape {
    return this.pool.get() ?? this.createShape();
  }

  update = (ticker: Ticker) => {
    this.elapsed += ticker.deltaMS;
    if (this.elapsed >= SETTINGS.spawnIntervalMS) {
      this.spawnShape();
      this.elapsed = 0;
    }

    this.moveShape();
  };

  moveShape() {
    for (let i = this.activeShapes.length - 1; i >= 0; i--) {
      const shape = this.activeShapes[i];
      if (shape.update()) this.releaseShape(shape, i);
    }
  }

  spawnShape() {
    const shape = this.getShape();
    shape.spawn();
    this.container.addChild(shape);
    this.activeShapes.push(shape);
  }


  //To do -> use it
  public destroy() {
    app.ticker.remove(this.update);
    // this.activeShapes.forEach todo
    this.activeShapes = [];
  }
}
