import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createBoard } from './board.js';

export function setupScene() {
  const canvas = document.querySelector('#gameCanvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#20487f');

  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(5, 5, 7);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(5, 8, 5);
  scene.add(dirLight);

  // Board
  const { boardGroup } = createBoard();
  scene.add(boardGroup);

  const cellMeshes = [];
  boardGroup.children.forEach((plane, layerIndex) => {
    plane.children.forEach((cube, idx) => {
      const row = Math.floor(idx / 3);
      const col = idx % 3;
      cube.userData.grid = { x: col, y: row, z: layerIndex };
      cellMeshes.push(cube);
    });
  });

  return { scene, camera, renderer, controls, cellMeshes };
}
