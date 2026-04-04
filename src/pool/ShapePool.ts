
import { FallingShape } from "../objects/FallingShape";

/**
 * Simple object pool for FallingShape instances;
 */
export class ShapePool {
  private pool: FallingShape[] = [];

  constructor() {
    // this.createPool();
  }

  public get(): FallingShape {
    return this.pool.pop() ?? new FallingShape();
  }

  public release(shape: FallingShape): void {
    this.pool.push(shape);
  }

  // public get size(): number {
  //   return this.pool.length;
  // }
}
