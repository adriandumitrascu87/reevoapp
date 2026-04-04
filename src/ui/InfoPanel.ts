
import { getCanvasPosition } from "../utils/screen";

/**
 * Info panel - displays current shape count and visible surface area;
 * Positioned above the top left corner of the canvas.
 */

export class InfoPanel {
  private panel?: HTMLElement | null;
  private shapesNumberEl?: HTMLElement | null;
  private shapesAreaEl?: HTMLElement | null;
  constructor() {
    this.panel = document.querySelector("#info-panel");
    this.shapesNumberEl = document.querySelector("#shapes-nr");
    this.shapesAreaEl = document.querySelector("#shapes-area");

    this.updatePosition();

    // app.renderer.on("resize", this.updatePosition)
  }

  public updateShapeNumbersText(count: number): void {
    if (!this.shapesNumberEl) return;
    this.shapesNumberEl.textContent = count.toString();
  }

  public updateAreaText(area: number): void {
    if (!this.shapesAreaEl) return;
    this.shapesAreaEl.textContent = area.toString();
  }

   // positions panel just above the top left corner of the canvas
  public updatePosition(): void {
    if (!this.panel) return;
    const { x, y } = getCanvasPosition();

    // if(!this.panel|| !this.panel.getBoundingClientRect()) return;

    const yPos = y - this.panel.getBoundingClientRect().height;

    // console.log(yPos, this.panel.getBoundingClientRect().height,this.panel.style.height );
    this.panel.style.left = `${x}px`;
    this.panel.style.top = `${yPos}px`;
  }
}
