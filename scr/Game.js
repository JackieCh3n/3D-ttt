// Game.js — Three.js scene + rendering + picking
import { Board3D, X, O, EMPTY } from './Board.js';

export class Game3D {
  constructor({ canvas, THREE, OrbitControls, onCell, onStatus }) {
    this.canvas = canvas;
    this.THREE = THREE;
    this.onCell = onCell;
    this.onStatus = onStatus;

    // scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0f1115);

    // camera
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    this.camera.position.set(6, 7, 10);

    // renderer
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.resize();

    // controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.target.set(1.5, 1.2, 0); // focus cube

    // lights
    const dir = new THREE.DirectionalLight(0xffffff, 1.0);
    dir.position.set(4, 6, 8);
    this.scene.add(dir, new THREE.AmbientLight(0xffffff, 0.35));

    // board state
    this.board = new Board3D();
    this.cellSize = 1.0;
    this.layerGap = 0.75; // z spacing

    // 3D groups
    this.gridGroup = new THREE.Group();
    this.marksGroup = new THREE.Group();
    this.winGroup = new THREE.Group();
    this.scene.add(this.gridGroup, this.marksGroup, this.winGroup);

    this._buildGrid();

    // picking
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this._registerPickingPlanes();

    window.addEventListener('resize', () => this.resize());
    this.canvas.addEventListener('pointerdown', (e) => this._onPointer(e));

    this.animate();
  }

  reset() {
    this.board = new Board3D();
    this._clearMarks();
    this._clearWin();
    this.onStatus?.('Your turn (X)');
  }

  resize() {
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
  }

  // ----- grid drawing (like your image) -----
  _buildGrid() {
    this.gridGroup.clear();
    const { THREE } = this;
    const c = this.cellSize;

    const frameMat = new THREE.LineBasicMaterial({ color: 0xc2b8a3 });
    const innerMat = new THREE.LineBasicMaterial({ color: 0xd9d2c0 });
    const vertMat  = new THREE.LineBasicMaterial({ color: 0xe1dbcc });

    const square = (z, mat, width=1.5) => {
      const g = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, z),
        new THREE.Vector3(3*c, 0, z),
        new THREE.Vector3(3*c, 3*c, z),
        new THREE.Vector3(0, 3*c, z),
        new THREE.Vector3(0, 0, z),
      ]);
      const line = new THREE.Line(g, mat.clone());
      line.material.linewidth = width;
      return line;
    };

    for (let z=0; z<3; z++) {
      const zc = this._cz(z);
      this.gridGroup.add(square(zc, frameMat));
      for (let i=1; i<3; i++) {
        // vertical grid lines on layer
        const gx = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(i*c, 0, zc),
          new THREE.Vector3(i*c, 3*c, zc)
        ]);
        const gy = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, i*c, zc),
          new THREE.Vector3(3*c, i*c, zc)
        ]);
        this.gridGroup.add(new THREE.Line(gx, innerMat.clone()));
        this.gridGroup.add(new THREE.Line(gy, innerMat.clone()));
      }
    }
    // vertical columns
    for (let i=0;i<4;i++) for (let j=0;j<4;j++) {
      const g = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(i*c, j*c, this._cz(0)),
        new THREE.Vector3(i*c, j*c, this._cz(2)),
      ]);
      this.gridGroup.add(new THREE.Line(g, vertMat.clone()));
    }
  }

  // invisible picking planes—one per cell
  _registerPickingPlanes() {
    const { THREE } = this;
    this.pickGroup = new THREE.Group();
    const mat = new THREE.MeshBasicMaterial({ visible:false });
    const geom = new THREE.PlaneGeometry(this.cellSize, this.cellSize);
    for (let z=0; z<3; z++) for (let y=0; y<3; y++) for (let x=0; x<3; x++) {
      const mesh = new THREE.Mesh(geom, mat);
      const [cx, cy, cz] = this._center(x,y,z);
      mesh.position.set(cx, cy, cz);
      mesh.rotation.x = -Math.PI/2; // make plane parallel to layer
      mesh.userData = { x,y,z };
      this.pickGroup.add(mesh);
    }
    this.scene.add(this.pickGroup);
  }

  // ----- marks -----
  drawMove(x,y,z, player) {
    if (!this.board.place(x,y,z, player)) return false;
    const mark = (player === X) ? this._XMark(x,y,z) : this._OMark(x,y,z);
    this.marksGroup.add(mark);
    return true;
  }

  _XMark(x,y,z) {
    const { THREE } = this;
    const [cx, cy, cz] = this._center(x,y,z);
    const r = 0.28 * this.cellSize;
    const mat = new THREE.LineBasicMaterial({ color: 0xcc3333, linewidth: 3 });
    const seg = (dx,dy) => {
      const g = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(cx-r*dx, cy, cz-r*dy),
        new THREE.Vector3(cx+r*dx, cy, cz+r*dy),
      ]);
      return new THREE.Line(g, mat.clone());
    };
    const g = new THREE.Group();
    const a = seg(1,1); const b = seg(1,-1);
    g.add(a,b);
    return g;
  }

  _OMark(x,y,z) {
    const { THREE } = this;
    const [cx, cy, cz] = this._center(x,y,z);
    const r = 0.32 * this.cellSize;
    const tube = 0.04;
    const geo = new THREE.TorusGeometry(r, tube, 12, 48);
    const mat = new THREE.MeshStandardMaterial({ color: 0x3366cc, metalness: 0.1, roughness: 0.4 });
    const m = new THREE.Mesh(geo, mat);
    m.rotation.x = -Math.PI/2;
    m.position.set(cx, cy, cz);
    return m;
  }

  highlightWin(coords) {
    this._clearWin();
    const { THREE } = this;
    const pts = coords.map(([x,y,z]) => {
      const [cx,cy,cz] = this._center(x,y,z);
      return new THREE.Vector3(cx, cy, cz);
    });
    const g = new THREE.BufferGeometry().setFromPoints(pts);
    const m = new THREE.LineBasicMaterial({ color: 0xdd3333, linewidth: 6 });
    const line = new THREE.Line(g, m);
    this.winGroup.add(line);
  }

  _clearMarks() { this.marksGroup.clear(); }
  _clearWin()   { this.winGroup.clear(); }

  // ----- picking handler -----
  _onPointer(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObjects(this.pickGroup.children, false);
    if (hits.length) {
      const { x,y,z } = hits[0].object.userData;
      this.onCell?.(x,y,z);
    }
  }

  // ----- helpers: board coords -> world -----
  _cx(x){ return (x+0.5)*this.cellSize; }
  _cy(y){ return (y+0.5)*this.cellSize; }
  _cz(z){ return (z+0.5)*this.layerGap; }
  _center(x,y,z) { return [this._cx(x), this._cy(y), this._cz(z)]; }

  // ----- loop -----
  animate = () => {
    requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };
}
