import { Board, X, O } from './Board.js';

export class Game3D {
  constructor({ canvas, THREE, OrbitControls, onCell, onStatus }) {
    this.canvas = canvas;
    this.THREE = THREE;
    this.onCell = onCell;
    this.onStatus = onStatus;

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x202020);

    // Scene + camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(4, 4, 6);

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // Lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(3, 5, 2);
    this.scene.add(light);
    this.scene.add(new THREE.AmbientLight(0x404040));

    // Logic
    this.board = new Board();
    this.cells = [];
    this.initBoard();

    window.addEventListener('resize', () => this.onResize());
    this.animate();
  }

  initBoard() {
    const geometry = new this.THREE.BoxGeometry(0.5, 0.5, 0.5);
    const material = new this.THREE.MeshPhongMaterial({ color: 0x0088ff });
    const offset = 1.2;

    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        for (let z = 0; z < 3; z++) {
          const cube = new this.THREE.Mesh(geometry, material.clone());
          cube.position.set((x - 1) * offset, (y - 1) * offset, (z - 1) * offset);
          this.scene.add(cube);
          this.cells.push({ cube, x, y, z });
        }
      }
    }

    // Grid helper
    const grid = new this.THREE.GridHelper(6, 6, 0x888888, 0x444444);
    grid.rotation.x = Math.PI / 2;
    this.scene.add(grid);
  }

  drawMove(x, y, z, player) {
    if (!this.board.makeMove(x, y, z, player)) return false;
    const idx = x * 9 + y * 3 + z;
    const cell = this.cells[idx];
    cell.cube.material.color.set(player === X ? 0xff4444 : 0x44ff44);
    return true;
  }

  reset() {
    this.scene.clear();
    this.board.clear();
    this.initBoard();
    this.onStatus?.('Your turn (X)');
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
