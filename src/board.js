// board.js
import * as THREE from 'three';

/**
 * Creates the 3-layer 3×3 board and returns { boardGroup, cubes }.
 */
export function createBoard() {
  const boxGeo = new THREE.BoxGeometry(0.7, 0.7, 0.7);
  const spacing = 1.6;
  const layerGap = 2.3;

  const boardGroup = new THREE.Group();
  const cubes = [];

  for (let layer = 0; layer < 3; layer++) {
    const plane = new THREE.Group();
    plane.position.z = (layer - 1) * layerGap;

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const mat = new THREE.MeshStandardMaterial({ color: 0x87cefa });
        const cube = new THREE.Mesh(boxGeo, mat);
        cube.position.set((col - 1) * spacing, (1 - row) * spacing, 0);
        cube.userData = { mark: null, layer, row, col };
        plane.add(cube);
        cubes.push(cube);
      }
    }

    boardGroup.add(plane);
  }

  return { boardGroup, cubes };
}
