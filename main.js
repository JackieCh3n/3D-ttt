// Now we can import using the short names, thanks to importmap
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// === Setup renderer, scene, and camera ===
const canvas = document.querySelector("#gameCanvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const scene = new THREE.Scene();
scene.background = new THREE.Color("rgba(251, 251, 251, 1)");

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(5, 5, 8);

// === Controls ===
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// === Lights ===
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 5);
scene.add(dirLight);

// === Create 3 stacked planes of 3×3 cubes ===
const boxGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
const baseMat = new THREE.MeshStandardMaterial({ color: 0x87cefa });
const spacing = 1.2;
const layerGap = 1.8;
const board = new THREE.Group();

const cubes = [];

for (let layer = 0; layer < 3; layer++) {
  const plane = new THREE.Group();
  plane.position.z = (layer - 1) * layerGap;

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const cube = new THREE.Mesh(
        boxGeo,
        new THREE.MeshStandardMaterial({ color: 0x87cefa })
      );
      cube.position.set((col - 1) * spacing, (1 - row) * spacing, 0);
      plane.add(cube);
    }
  }

  board.add(plane);
}

scene.add(board);

// === Handle window resize ===
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// === Animate ===
function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
