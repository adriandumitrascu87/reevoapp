# Setup

# Run
```bash
npm install
npm run dev
```


# Configuration
Most game parameters live in `src/settings/settings.ts` and can be adjusted directly


- `gravity` — how fast shapes accelerate as they fall;
- `maxFallSpeed` — top falling speed;
- `spawnIntervalMS` — time between auto-spawns (1000ms = 1 shape/s);
- `shapeCacheSize` — how many unique textures are pregenerated at startup;
- `shapeMinSize` / `shapeMaxSize` — shape size rage - percent of game canvas width;
- `poolSize.initialSize` — how many shapes are preallocated on startup;
- `padding.horizontal/vertical` — canvas margins as a fraction of screen size;

# Notes

The canvas is fully responsive - it recalculates size and position on every resize;

Shape area is calculated by reading pixel data from the rendered game container (no  geometry math or shapes overlaping).

Shapes and textures are both pooled - (textrue poll is recreated at resize to mentain the relative size of the shapes to the stage/scene)
