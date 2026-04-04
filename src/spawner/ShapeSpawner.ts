import { Container, EventEmitter, Ticker } from "pixi.js";
import { ShapePool } from "../pool/ShapePool";
import { app } from "../app";
import { SETTINGS } from "../settings/settings";
import { FallingShape } from "../objects/FallingShape";
import { getCanvasSize } from "../utils/screen";


/**
 * Manages shape spawning, movement and lifecycle.
 */

export class ShapeSpawner {
 private  container: Container;
 private  pool: ShapePool;
 private  elapsed: number = 0;
 private  activeShapes: FallingShape[] = [];
 public emitter = new EventEmitter();

  constructor(container: Container) {
    this.container = container;
    this.pool = new ShapePool();
    this.populatePool();
    app.ticker.add(this.update);
  }

  // fills the pool at startup;
  populatePool() {
    for (let i = 0; i < SETTINGS.poolSize.initialSize; i++) {
      this.pool.release(this.createShape());
    }
  }

  private createShape(): FallingShape {
    const shape = new FallingShape();
    return shape;
  }

  // removes shape from active list and returns it to pool
  private onShapeClicked = (shape: FallingShape): void => {
    // console.log("emitted", shape);
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
    const shape = this.pool.get();

    //maybe
    shape.off("shapeClicked", this.onShapeClicked);
    shape.on("shapeClicked", this.onShapeClicked);

    return shape;
  }

  // moves all active shapes and releases any that have fallen offscreen
  // emits visible count after every update
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

    const count = this.checkVisibleCount();
    this.emitInfo(count);
  }

  // counts shapes that are at least partially visible within the canvas bounds
  checkVisibleCount(): number {
    let count = 0;

    for (const shape of this.activeShapes) {
      if (this.isVisible(shape)) count++;
    }

    return count;
  }

  spawnShape() {
    const shape = this.getShape();
    shape.spawn();
    this.container.addChild(shape);
    this.activeShapes.push(shape);
  }

  public spawnAtPosition(x: number, y: number): void {
    const shape = this.getShape();
    shape.spawnAt(x, y);
    this.container.addChild(shape);
    this.activeShapes.push(shape);
  }

  emitInfo(count: number) {
    this.emitter.emit("shapeNumberChanged", count);
  }

  // shape is visible if any part of it is within canvas vertical bounds
  private isVisible(shape: FallingShape): boolean {
    const { height } = getCanvasSize();
    return (
      shape.y + shape.height / 2 > 0 && shape.y - shape.height / 2 < height
    );
  }
  //To do -> use it
  public destroy() {
    app.ticker.remove(this.update);
    this.activeShapes.forEach((shape, i) => this.releaseShape(shape, i));
    this.activeShapes = [];
  }
}
