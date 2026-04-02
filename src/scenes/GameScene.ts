import { Container, Graphics } from "pixi.js";
import { app } from "../app";
import { getCanvasPosition, getCanvasSize } from "../utils/screen";
import { PALETTE } from "../settings/palette";

export class GameScene {
  mainContainer?: Container;
  backgroundContainer?: Container;
  gameContainer?: Container;
  uiContainer?: Container;

  canvas?: Graphics;

  constructor() {
    this.initContainers();
    this.initProps();
    this.initEvents();
  }

  initEvents() {
    app.renderer.on("resize", this.handleResize);
  }

  handleResize=()=> {
    this.drawCanvas();
    this.centerMainContainer();
  }

  //TODO to call
  public destroy() {

    app.renderer.off("resize", this.handleResize);
    this.mainContainer?.destroy()

  }

  initContainers() {
    this.mainContainer = new Container();
    this.backgroundContainer = new Container();
    this.gameContainer = new Container();
    this.uiContainer = new Container();

    this.canvas = new Graphics();
    this.backgroundContainer.addChild(this.canvas);

    this.mainContainer.addChild(
      this.backgroundContainer,
      this.gameContainer,
      this.uiContainer,
    );
  }

  initProps() {
    this.drawCanvas();
    this.centerMainContainer();
  }

  centerMainContainer() {
    if (!this.mainContainer) return;

    const { x, y } = getCanvasPosition();

    this.mainContainer.x = x;
    this.mainContainer.y = y;
  }

  drawCanvas() {
    if (!this.canvas) return;
    const { width, height } = getCanvasSize();

    this.canvas.clear();
    this.canvas.rect(0, 0, width, height);
    this.canvas.fill(PALETTE.canvas.background);
    this.canvas.stroke({
      width: PALETTE.canvas.borderWidth,
      color: PALETTE.canvas.border,
    });
  }
}
