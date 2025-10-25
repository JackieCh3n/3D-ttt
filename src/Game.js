import { Board, X, O } from './Board.js';

export class Game3D {
  constructor({ canvas, THREE, OrbitControls, onCell, onStatus }) {
    this.canvas = canvas;
    this.THREE = THREE;
    this.onCell = onCell;
    this.onStatus = onStatus;
    this.scene = new THREE.Scene();
    this.board = new Board();
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(5, 5, 5);
    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.initBoard();
    this.animate();
  }

  initBoard() {
    // setup 3D board visuals
    const geometry = new this.THREE.BoxGeometry(1, 1, 1);
    const material = new this.THREE.MeshBasicMaterial({ color: 0x4444ff, wireframe: true });
    this.cells = [];
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        for (let z = 0; z < 3; z++) {
          const cube = new this.THREE.Mesh(geometry, material.clone());
          cube.position.set(x * 1.2 - 1.2, y * 1.2 - 1.2, z * 1.2 - 1.2);
          this.scene.add(cube);
          this.cells.push({ cube, x, y, z });
        }
      }
    }
  }

  drawMove(x, y, z, player) {
    if (!this.board.makeMove(x, y, z, player)) return false;
    const idx = x * 9 + y * 3 + z;
    const cell = this.cells[idx];
    cell.cube.material.color.set(player === X ? 0xff0000 : 0x00ff00);
    return true;
  }

  highlightWin(winLine) {
    winLine.forEach(([x, y, z]) => {
      const idx = x * 9 + y * 3 + z;
      this.cells[idx].cube.material.color.set(0xffff00);
    });
  }

  reset() {
    // clear scene & rebuild
    this.scene.clear();
    this.board.clear();
    this.initBoard();
    this.onStatus?.('Your turn (X)');
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
