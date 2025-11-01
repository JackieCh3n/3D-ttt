// src/ai.js

// All 3-in-a-row lines in a 3x3x3 tic tac toe
const LINES = [
  // rows on each layer (z fixed)
  [[0,0,0],[0,1,0],[0,2,0]], [[1,0,0],[1,1,0],[1,2,0]], [[2,0,0],[2,1,0],[2,2,0]],
  [[0,0,1],[0,1,1],[0,2,1]], [[1,0,1],[1,1,1],[1,2,1]], [[2,0,1],[2,1,1],[2,2,1]],
  [[0,0,2],[0,1,2],[0,2,2]], [[1,0,2],[1,1,2],[1,2,2]], [[2,0,2],[2,1,2],[2,2,2]],

  // columns on each layer
  [[0,0,0],[1,0,0],[2,0,0]], [[0,1,0],[1,1,0],[2,1,0]], [[0,2,0],[1,2,0],[2,2,0]],
  [[0,0,1],[1,0,1],[2,0,1]], [[0,1,1],[1,1,1],[2,1,1]], [[0,2,1],[1,2,1],[2,2,1]],
  [[0,0,2],[1,0,2],[2,0,2]], [[0,1,2],[1,1,2],[2,1,2]], [[0,2,2],[1,2,2],[2,2,2]],

  // verticals through layers (x,y fixed)
  [[0,0,0],[0,0,1],[0,0,2]],
  [[0,1,0],[0,1,1],[0,1,2]],
  [[0,2,0],[0,2,1],[0,2,2]],
  [[1,0,0],[1,0,1],[1,0,2]],
  [[1,1,0],[1,1,1],[1,1,2]],
  [[1,2,0],[1,2,1],[1,2,2]],
  [[2,0,0],[2,0,1],[2,0,2]],
  [[2,1,0],[2,1,1],[2,1,2]],
  [[2,2,0],[2,2,1],[2,2,2]],

  // diagonals on each layer
  [[0,0,0],[1,1,0],[2,2,0]], [[0,2,0],[1,1,0],[2,0,0]],
  [[0,0,1],[1,1,1],[2,2,1]], [[0,2,1],[1,1,1],[2,0,1]],
  [[0,0,2],[1,1,2],[2,2,2]], [[0,2,2],[1,1,2],[2,0,2]],

  // diagonals through space
  [[0,0,0],[1,1,1],[2,2,2]],
  [[2,0,0],[1,1,1],[0,2,2]],
  [[0,2,0],[1,1,1],[2,0,2]],
  [[2,2,0],[1,1,1],[0,0,2]],
];

// board is board[z][y][x] and each cell is: 0 = empty, 1 = human, 2 = ai
export function checkWinner(board) {
  for (const line of LINES) {
    const vals = line.map(([x,y,z]) => board[z][y][x]);
    if (vals[0] !== 0 && vals[0] === vals[1] && vals[1] === vals[2]) {
      return vals[0]; // 1 or 2
    }
  }
  return 0;
}

function getEmptyCells(board) {
  const cells = [];
  for (let z = 0; z < 3; z++) {
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        if (board[z][y][x] === 0) cells.push({ x, y, z });
      }
    }
  }
  return cells;
}

// Try to find winning move for playerId (1 = human, 2 = ai)
function findWinningMove(board, playerId) {
  for (const line of LINES) {
    const vals = line.map(([x,y,z]) => board[z][y][x]);
    const countMe = vals.filter(v => v === playerId).length;
    const countEmpty = vals.filter(v => v === 0).length;
    if (countMe === 2 && countEmpty === 1) {
      // return the empty one
      const idx = vals.findIndex(v => v === 0);
      const [x,y,z] = line[idx];
      return { x, y, z };
    }
  }
  return null;
}

export function aiChooseMove(board) {
  // 1) Can AI win?
  const winMove = findWinningMove(board, 2);
  if (winMove) return winMove;

  // 2) Can human win next? block
  const blockMove = findWinningMove(board, 1);
  if (blockMove) return blockMove;

  // 3) else pick center if empty
  if (board[1][1][1] === 0) return { x: 1, y: 1, z: 1 };

  // 4) else random empty
  const empties = getEmptyCells(board);
  if (empties.length === 0) return null;
  return empties[Math.floor(Math.random() * empties.length)];
}
