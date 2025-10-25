export const X = "X";
export const O = "O";

export class Board {
  constructor() {
    this.cells = Array(27).fill(null); // 3×3×3
  }

  index(x, y, z) {
    return x * 9 + y * 3 + z;
  }

  makeMove(x, y, z, player) {
    const i = this.index(x, y, z);
    if (this.cells[i]) return false;
    this.cells[i] = player;
    return true;
  }

  clear() {
    this.cells.fill(null);
  }
}
