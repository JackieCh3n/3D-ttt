// pieces.js
import * as THREE from 'three';

/**
 * Replaces a cube with an X or O 3D piece.
 * @param {THREE.Mesh} cube - The cube that was clicked.
 * @param {string} symbol - 'X' or 'O'
 * @param {THREE.Scene} scene - The scene to add the new mesh into.
 */
export function createPiece(cube, symbol, scene) {
  // Get world position before removing cube
  const worldPos = new THREE.Vector3();
  cube.getWorldPosition(worldPos);
  cube.parent.remove(cube);

  let mesh;

  if (symbol === 'X') {
    // 🔵 Create a smooth, metallic blue 3D "X" using two intersecting cylinders
    const group = new THREE.Group();
    const cylGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.9, 32);
    const mat = new THREE.MeshPhysicalMaterial({
      color: 0x4d7fff,
      metalness: 0.5,
      roughness: 0.25,
      clearcoat: 1.0,
      reflectivity: 0.9,
    });

    const bar1 = new THREE.Mesh(cylGeo, mat);
    const bar2 = new THREE.Mesh(cylGeo, mat);

    // Rotate to form an X
    bar1.rotation.z = Math.PI / 4;
    bar2.rotation.z = -Math.PI / 4;

    group.add(bar1, bar2);
    mesh = group;

  } else {
    // 🔴 Create a glossy red sphere for O
    const sphereGeo = new THREE.SphereGeometry(0.45, 32, 32);
    const mat = new THREE.MeshPhysicalMaterial({
      color: 0xff4d4d,
      metalness: 0.4,
      roughness: 0.2,
      clearcoat: 1.0,
      reflectivity: 1.0,
    });
    mesh = new THREE.Mesh(sphereGeo, mat);
  }

  // Place new piece exactly where cube was
  mesh.position.copy(worldPos);
  scene.add(mesh);
}
