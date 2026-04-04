import {
  Container,
  FederatedPointerEvent,
  Graphics,
  RenderTexture,
} from "pixi.js";
import { app } from "../app";
import { getCanvasPosition, getCanvasSize } from "../utils/screen";
import { PALETTE } from "../settings/palette";
import { ShapeSpawner } from "../spawner/ShapeSpawner";
import { InfoPanel } from "../ui/InfoPanel";
import { ShapeFactory } from "../factory/ShapeFactory";
import { ControlsPanel } from "../ui/ControlsPanel";
import { FPSMeter } from "../ui/FPSmeter";

/**
 * Main game scene — owns the canvas, mask, containers and spawner
 */

export class GameScene extends Container {

  private backgroundContainer?: Container;
  private gameContainer?: Container;
  private uiContainer?: Container;

  private spawner?: ShapeSpawner;
  private canvasMask ?: Graphics;
  private canvas?: Graphics;

  private infoPanel?: InfoPanel;
  private controlsPanel?: ControlsPanel;
  // reused every area calculation
  private renderTexture?: RenderTexture;
  fpsMeter?: FPSMeter;

  constructor() {
    super();
    this.initContainers();
    this.initProps();
    this.addShapeSpawner();
    this.initMask();
    this.initUI();
    this.initEvents();
  }

  initUI() {
    this.infoPanel = new InfoPanel();
    this.controlsPanel = new ControlsPanel();
    this.fpsMeter = new FPSMeter();
    this.uiContainer?.addChild(this.fpsMeter)
    const { width, height } = getCanvasSize();

    this.renderTexture = RenderTexture.create({ width, height });
  }

  addShapeSpawner() {
    if (!this.gameContainer) return;
    this.spawner = new ShapeSpawner(this.gameContainer);
  }

  initMask() {
    const { width, height } = getCanvasSize();
    this.canvasMask  = new Graphics();
    this.canvasMask .rect(0, 0, width, height);
    this.canvasMask .fill(0xffffff);

    if (!this.gameContainer) return;
    this.gameContainer.mask = this.canvasMask ;
    this.gameContainer.addChild(this.canvasMask );
  }

  // redrawn on resize
  updateMask() {
    if (!this.canvasMask ) return;
    const { width, height } = getCanvasSize();

    this.canvasMask .clear();
    this.canvasMask .rect(0, 0, width, height);
    this.canvasMask .fill(0xffffff);
  }

  initEvents() {
    app.renderer.on("resize", this.handleResize);
    if (!this.backgroundContainer) return;

    this.backgroundContainer.on("pointerdown", this.handleClick);
    this.backgroundContainer.eventMode = "static";

    // listen for shape count changes from spawner
    if (this.spawner)
      this.spawner?.emitter.on(
        "shapeNumberChanged",
        this.handleShapeNumberChanged,
      );
  }

  // triggered by spawner when shapes are added or removed
  handleShapeNumberChanged = (count: number) => {
    this.infoPanel?.updateShapeNumbersText(count);
    this.infoPanel?.updateAreaText(this.updateArea());


  };

  // counts visible pixels in the masked game container
  private updateArea(): number {
    if (!this.canvasMask || !this.gameContainer || !this.renderTexture) return 0;

    let filledPixels = 0;

    app.renderer.render({
      container: this.gameContainer,
      target: this.renderTexture,
    });

    const pixels = app.renderer.extract.pixels(this.renderTexture);
    for (let i = 3; i < pixels.pixels.length; i += 4) {
      const pixelAlpha = pixels.pixels[i];

      if (pixelAlpha > 0) filledPixels++;
    }

    //lost context - render texture too heaavy
    // renderTexture.destroy();
    //device pixel ratio to check?
    return filledPixels;
  }

  // spawns an irregular shape at click position within the background container
  handleClick = (e: FederatedPointerEvent) => {
    if (!this.spawner || !this.backgroundContainer) return;

    e.stopPropagation();

    const local = this.backgroundContainer.toLocal(e.global);
    this.spawner.spawnAtPosition(local.x, local.y);
  
  };

  handleResize = () => {
    this.drawCanvas();
    this.centerMainContainer();
    this.updateMask();
    this.infoPanel?.updatePosition();
    this.controlsPanel?.updatePosition();

    const { width, height } = getCanvasSize();
    this.renderTexture?.resize(width, height);

    // regenerates texture cache on resize since shape size is relative to canvas width
    // NOTE: this is heavy
    ShapeFactory.generateCache();
  };

  //TODO to call
  public destroy() {
    app.renderer.off("resize", this.handleResize);
    this.spawner?.destroy();
    this.renderTexture?.destroy();
    
  }

  initContainers() {
  
    this.backgroundContainer = new Container();
    this.gameContainer = new Container();
    this.uiContainer = new Container();

    this.canvas = new Graphics();
    this.backgroundContainer.addChild(this.canvas);

    this.addChild(
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


    const { x, y } = getCanvasPosition();

    this.x = x;
    this.y = y;
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
