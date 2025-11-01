// src/winner.js
// Defines every 3-in-a-row combination in 3×3×3 tic-tac-toe
const LINES = [
  // rows (x-direction) for each y,z
  ...[0,1,2].flatMap(z =>
    [0,1,2].map(y => [[0,y,z],[1,y,z],[2,y,z]])
  ),
  // columns (y-direction)
  ...[0,1,2].flatMap(z =>
    [0,1,2].map(x => [[x,0,z],[x,1,z],[x,2,z]])
  ),
  // verticals (z-direction)
  ...[0,1,2].flatMap(x =>
    [0,1,2].map(y => [[x,y,0],[x,y,1],[x,y,2]])
  ),
  // diagonals on xy planes
  ...[0,1,2].flatMap(z => [
    [[0,0,z],[1,1,z],[2,2,z]],
    [[0,2,z],[1,1,z],[2,0,z]]
  ]),
  // diagonals on xz planes
  ...[0,1,2].flatMap(y => [
    [[0,y,0],[1,y,1],[2,y,2]],
    [[0,y,2],[1,y,1],[2,y,0]]
  ]),
  // diagonals on yz planes
  ...[0,1,2].flatMap(x => [
    [[x,0,0],[x,1,1],[x,2,2]],
    [[x,0,2],[x,1,1],[x,2,0]]
  ]),
  // main space diagonals
  [[0,0,0],[1,1,1],[2,2,2]],
  [[0,0,2],[1,1,1],[2,2,0]],
  [[0,2,0],[1,1,1],[2,0,2]],
  [[2,0,0],[1,1,1],[0,2,2]]
];

/**
 * Checks the board for a winner.
 * @param {number[][][]} boardState 3-D array (0 = empty, 1 = player, 2 = AI)
 * @returns {number} 0 = no winner, 1 = player wins, 2 = AI wins
 */
export function checkWinner(boardState) {
  for (const line of LINES) {
    const [a,b,c] = line;
    const v1 = boardState[a[2]][a[1]][a[0]];
    const v2 = boardState[b[2]][b[1]][b[0]];
    const v3 = boardState[c[2]][c[1]][c[0]];
    if (v1 !== 0 && v1 === v2 && v2 === v3) return v1;
  }
  return 0;
}

/**
 * Utility to see if every cell is filled.
 */
export function isBoardFull(boardState) {
  return boardState.every(layer =>
    layer.every(row => row.every(cell => cell !== 0))
  );
}
