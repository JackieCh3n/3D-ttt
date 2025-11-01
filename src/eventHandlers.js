import * as THREE from 'three';
import { onPlayerMove } from './gameLogic.js';

/**
 * Initializes all event listeners for the 3D Tic-Tac-Toe game.
 * 
 * @param {THREE.WebGLRenderer} renderer - The WebGL renderer used for picking.
 * @param {THREE.Camera} camera - The active camera in the scene.
 * @param {Object} scene - The 3D scene object.
 * @param {Object} controls - OrbitControls for smooth interaction.
 * @param {THREE.Object3D[]} cellMeshes - Array of all clickable cube meshes.
 * @param {Function} onResizeCallback - Optional callback when window resizes.
 */
export function initEventHandlers(renderer, camera, scene, controls, cellMeshes, onResizeCallback) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // --- Handle mouse clicks ---
  function handleMouseDown(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(cellMeshes);

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      const { x, y, z } = hit.userData.grid;
      onPlayerMove(x, y, z, scene); // Pass control to game logic
    }
  }

  // --- Handle window resize ---
  function handleResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    if (typeof onResizeCallback === 'function') {
      onResizeCallback();
    }
  }

  // --- Attach listeners ---
  window.addEventListener('mousedown', handleMouseDown);
  window.addEventListener('resize', handleResize);

  // Optional: Return cleanup function
  return () => {
    window.removeEventListener('mousedown', handleMouseDown);
    window.removeEventListener('resize', handleResize);
  };
}
