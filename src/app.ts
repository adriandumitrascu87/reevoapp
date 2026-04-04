import { Application } from "pixi.js";

/**
 * global Application instance.
 * Imported directly by any class that needs access to the renderer or ticker.
 */
export const app = new Application();