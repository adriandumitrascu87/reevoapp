import { app } from "./app";
import { ShapeFactory } from "./factory/ShapeFactory";
import './global.css';
import { GameScene } from "./scenes/GameScene";
import { PALETTE } from "./settings/palette";

(async () => {
  await app.init({
    resizeTo: window,
    preference: "webgl",
    antialias: true,
    backgroundColor: PALETTE.app.background,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  });
  
  document.body.appendChild(app.canvas);
  ShapeFactory.generateCache();

  const game = new GameScene();
  app.stage.addChild(game);
})();
