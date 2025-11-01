import { setupScene } from './src/setupScene.js';
import { setupUI } from './src/ui.js';
import { initGame } from './src/gameLogic.js';
import { initEventHandlers } from './src/eventHandlers.js';

// === 1. Setup Three.js Scene ===
const { scene, camera, renderer, controls, cellMeshes } = setupScene();

// === 2. Setup UI (overlay + buttons) ===
const { restartBtn } = setupUI();

// === 3. Initialize Game Logic ===
const { animate } = initGame(scene, camera, renderer, controls, cellMeshes);

// === 4. Initialize Event Handlers (mouse, resize, etc.) ===
initEventHandlers(renderer, camera, scene, controls, cellMeshes);

// === 5. Restart Button ===
restartBtn.addEventListener('click', () => window.location.reload());

// === 6. Start Rendering Loop ===
animate();
