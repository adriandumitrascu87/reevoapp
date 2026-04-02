import { Container, Ticker } from "pixi.js";
import { ShapePool } from "../pool/ShapePool";
import { app } from "../app";
import { getCanvasSize } from "../utils/screen";
import { ShapeFactory } from "../factory/ShapeFactory";
import { SETTINGS } from "../settings/settings";

export class ShapeSpawner {
  private readonly spawnIntervalMs = 1000;
  container: Container;
  pool: ShapePool;
  elapsed: number = 0;
  activeShapes: any[] = [];
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
    const { width, height } = getCanvasSize();

    const sprite = this.pool.get();
    const randomShapeTexture = ShapeFactory.getRandomTexture();
    // sprite.anchor.set(0.5, 0.5);

    sprite.texture = randomShapeTexture;

    sprite.x = sprite.width/2 + Math.random() * (width - sprite.width);
    sprite.y = -sprite.height/2;

    sprite.visible = true;

    this.container.addChild(sprite);
    this.activeShapes.push({
      sprite,
      speed: SETTINGS.gravity,
    });
  }

  moveShape() {
    const { height } = getCanvasSize();

    for (let i = this.activeShapes.length - 1; i >= 0; i--) {
      const { sprite, speed } = this.activeShapes[i];

      sprite.y += speed;

      if (sprite.y > height + sprite.height / 2) {
        this.container.removeChild(sprite);
        this.pool.release(sprite);
        this.activeShapes.splice(i, 1);
      }
    }
  }

  //To do -> use it
  public destroy() {
    app.ticker.remove(this.update);
    // this.activeShapes.forEach(
    this.activeShapes = [];
  }
}
