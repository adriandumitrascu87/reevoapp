import { FederatedPointerEvent, Sprite, Texture } from "pixi.js";
import { getCanvasSize } from "../utils/screen";
import { ShapeFactory } from "../factory/ShapeFactory";
import { SETTINGS } from "../settings/settings";
import { createIrregularTexture } from "../utils/shapesTexture";

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
    // console.log("listener count:", this.listenerCount("pointerdown"));
    if (!this.active) return;
    e.stopPropagation();
    // console.log("emitting shapeClicked");
    this.emit("shapeClicked", this);
    // console.log("emitted");
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

  public spawnAt(x: number, y: number): void {
    this.texture = createIrregularTexture();
    this.x = x;
    this.y = y;
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
