import { Container, FederatedPointerEvent, Sprite, Texture } from "pixi.js";
import { getCanvasSize } from "../utils/screen";
import { ShapeFactory } from "../factory/ShapeFactory";
import { SETTINGS } from "../settings/settings";

export class FallingShape extends Sprite {
  velocity: number = 0;
  active: boolean = false;

  constructor() {
    super();

    this.anchor.set(0.5, 0.5);

    this.eventMode = "static";
    this.on("pointerdown", this.handleClick);
  }

  private handleClick = (e: FederatedPointerEvent) => {
    console.log("Click");
    if (!this.active) return;
    e.stopPropagation();
    this.emit("shapeClicked", this);
  };

  spawn() {
    const { width } = getCanvasSize();

    this.texture = ShapeFactory.getRandomTexture();
    // this.rotation = Math.random() * Math.PI * 2;
    this.x = this.width / 2 + Math.random() * (width - this.width);
    this.y = -this.height / 2;



    this.visible = true;
    this.velocity = 0;
    this.active = true;
  }

  public update(): boolean {
    const { height } = getCanvasSize();

    const newVelocity = this.velocity + SETTINGS.gravity;
    this.velocity = Math.min(newVelocity, SETTINGS.maxFallSpeed);

    this.y += this.velocity;

    if (this.y > height + this.height / 2) {
      return true;
    }

    return false;
  }

  //to do -> use it

  public reset(): void {
    this.visible = false;
    this.texture = Texture.EMPTY;
    this.velocity = 0;
    this.active = false;
  }
}
