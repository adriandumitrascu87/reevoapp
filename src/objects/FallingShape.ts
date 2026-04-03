import { Container, Sprite } from "pixi.js";
import { getCanvasSize } from "../utils/screen";
import { ShapeFactory } from "../factory/ShapeFactory";
import { SETTINGS } from "../settings/settings";

export class FallingShape {
  container: Container;
  sprite!: Sprite;
  velocity: number = 0;

  constructor(sprite: Sprite, container: Container) {
    this.sprite = sprite;
    this.container = container;
    this.container.addChild(this.sprite);
  }

  spawn() {
    const { width } = getCanvasSize();

    this.sprite.texture = ShapeFactory.getRandomTexture();

    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.x =
      this.sprite.width / 2 + Math.random() * (width - this.sprite.width);
    this.sprite.y = -this.sprite.height / 2;

    this.sprite.visible = true;
    this.velocity = 0;
  }

  public update(): boolean {
    const { height } = getCanvasSize();

    const newVelocity = this.velocity + SETTINGS.gravity;
    this.velocity = Math.min(newVelocity, SETTINGS.maxFallSpeed);

    this.sprite.y += this.velocity;

    if (this.sprite.y > height + this.sprite.height / 2) {
      return true;
    }

    return false;
  }

  //to do -> use it

  public destroy(container: Container): void {
    container.removeChild(this.sprite);
  }
}
