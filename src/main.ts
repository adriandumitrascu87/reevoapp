import { app } from "./app";
import { ShapeFactory } from "./factory/ShapeFactory";
import "./global.css";
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

  // console.log("screen:", app.screen.width, app.screen.height);
  // console.log("window:", window.innerWidth, window.innerHeight);

  ShapeFactory.generateCache();
  const game = new GameScene();
  if (game && game.mainContainer) app.stage.addChild(game.mainContainer);
})();
