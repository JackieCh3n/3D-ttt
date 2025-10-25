// Board.js — state + win detection for 3×3×3
export const EMPTY = 0, X = 1, O = 2;

export class Board3D {
  constructor() {
    this.state = Array.from({ length: 3 }, () =>
      Array.from({ length: 3 }, () => Array(3).fill(EMPTY))
    ); // state[z][y][x]
  }

  clone() {
    const b = new Board3D();
    for (let z = 0; z < 3; z++)
      for (let y = 0; y < 3; y++)
        for (let x = 0; x < 3; x++) b.state[z][y][x] = this.state[z][y][x];
    return b;
  }

  place(x, y, z, player) {
    if (this.state[z][y][x] !== EMPTY) return false;
    this.state[z][y][x] = player;
    return true;
  }

  getEmpty() {
    const moves = [];
    for (let z = 0; z < 3; z++)
      for (let y = 0; y < 3; y++)
        for (let x = 0; x < 3; x++)
          if (this.state[z][y][x] === EMPTY) moves.push({ x, y, z });
    return moves;
  }

  winnerLine() {
    const lines = allLines();
    for (const L of lines) {
      const [a,b,c] = L.map(([x,y,z]) => this.state[z][y][x]);
      if (a !== EMPTY && a === b && b === c) return L;
    }
    return null;
  }

  isFull() { return this.getEmpty().length === 0; }
}

export function allLines() {
  const L = [];
  const idx = [0,1,2];

  for (let z of idx) {
    for (let y of idx) L.push( idx.map(x => [x,y,z]) );
    for (let x of idx) L.push( idx.map(y => [x,y,z]) );
    L.push([[0,0,z],[1,1,z],[2,2,z]]);
    L.push([[0,2,z],[1,1,z],[2,0,z]]);
  }
  for (let y of idx) for (let x of idx) L.push( idx.map(z => [x,y,z]) );

  L.push([[0,0,0],[1,1,1],[2,2,2]]);
  L.push([[0,2,0],[1,1,1],[2,0,2]]);
  L.push([[2,0,0],[1,1,1],[0,2,2]]);
  L.push([[2,2,0],[1,1,1],[0,0,2]]);

  return L;
}
