import { Text } from "pixi.js";
import { app } from "../app";


export class FPSMeter extends Text {
  constructor() {
    super({
      text: 'FPS: 0',
      style: {
        fontSize: 12,
        fill: 0xffffff,
        fontFamily: 'Arial',
      }
    });

    this.x = 8;
    this.y = 8;

    app.ticker.add(this.update);
  }

  private update = () => {
    this.text = `FPS: ${Math.round(app.ticker.FPS)}`;
  };

  //not needed for this type of project
  public destroy(): void {
    app.ticker.remove(this.update);
    super.destroy();
  }
}