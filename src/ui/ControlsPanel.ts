import { SETTINGS } from "../settings/settings";
import { getCanvasPosition, getCanvasSize } from "../utils/screen";

/**
 * Controls panel
 * Handles spawn rate and gravity adjustments via HTML buttons;
 * reads/writes directly to SETTINGS so changes are picked up globally;
 */


export class ControlsPanel {
  private panel: HTMLElement | null;
  private gravityPanel: HTMLElement | null;

  private spawnValue: HTMLElement | null;
  private gravityValue: HTMLElement | null;


  private gravityChange: number = 0.05;

  constructor() {
    this.panel = document.querySelector("#controls-panel");
    this.gravityPanel = document.querySelector("#gravity-panel");

    this.spawnValue = document.querySelector("#spawn-value");
    this.gravityValue = document.querySelector("#gravity-value");

    this.initValues();
    this.iniEvents();

    this.updatePosition();
  }

  private initValues() {
    if (this.gravityValue)
      this.gravityValue.textContent = SETTINGS.gravity.toFixed(2);
    if (this.spawnValue)
      this.spawnValue.textContent = Math.round(1000 / SETTINGS.spawnIntervalMS).toString();;
  }

  //maps button ids to actions 
  private iniEvents() {
    const actions: Record<string, () => void> = {
      "spawn-minus": () => this.updateSpawnRate(-1),
      "spawn-plus": () => this.updateSpawnRate(1),
      "gravity-minus": () => this.updateGravity(-this.gravityChange),
      "gravity-plus": () => this.updateGravity(this.gravityChange),
    };

    document.addEventListener("click", (e: MouseEvent) => {
      const id = (e.target as HTMLElement).id;
      if (actions[id]) actions[id]();
    });
  }

  // min 1 shape/s, no upper limit
  // converts between shapes/s and spawnIntervalMS (SETTINGS)
  private updateSpawnRate(delta: number): void {
    const currentRate = Math.round(1000 / SETTINGS.spawnIntervalMS);
    const newRate = Math.max(1, currentRate + delta); 
    SETTINGS.spawnIntervalMS = 1000 / newRate;
    if (this.spawnValue) this.spawnValue.textContent = newRate.toString();
  }


  // updates gravity directly in SETTINGS; min 0.01, no upper limit
  private updateGravity(delta: number): void {
    SETTINGS.gravity = parseFloat(
      Math.max(0.01, SETTINGS.gravity + delta).toFixed(2), // min 0.01, no upper limit
    );
    if (this.gravityValue)
      this.gravityValue.textContent = SETTINGS.gravity.toFixed(2);
  }

    // positions controls panel at the bottom of the canvas
  public updatePosition(): void {
    const { x, y } = getCanvasPosition();
    const { width, height } = getCanvasSize();

    if (this.panel) {
      this.panel.style.left = `${x}px`;
      this.panel.style.top = `${y + height}px`;
      this.panel.classList.remove('hidden');
    }

    if (!this.gravityPanel) return;
    const gravityWidth = this.gravityPanel.getBoundingClientRect().width;

    this.gravityPanel.style.position = "absolute";
    this.gravityPanel.style.left = `${width - gravityWidth}px`;
    // this.gravityPanel.style.top = `${y + height}px`;

  }
}
