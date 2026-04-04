export const SETTINGS = {
  padding: {
    horizontal: 0.05, // 5% of screen width
    vertical: 0.2, // 20% of screen height
  },
  poolSize: {
    initialSize: 20, // number of shapes preallocated at startup
  },
  // shape size range in percent of game canvas width; random value between min and max
  shapeMinSize: 7.5,
  shapeMaxSize: 15,
  
  gravity: 0.05, // acceleration added to velocity each frame; min 0.01, no upper limit
  maxFallSpeed: 100, // terminal velocity in px/frame
  spawnIntervalMS: 1000, // min 1 shape/s (1000ms), no upper limit
  shapeCacheSize: 100,// texture cache; number of unique shape textures pregenerated at startup
} 