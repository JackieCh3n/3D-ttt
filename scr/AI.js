// AI.js — simple lookahead: win if possible, block if needed, else center/random
import { Board3D, EMPTY, X, O } from './Board.js';

export function aiMove(board, ai = O, human = X) {
  // 1) Try a winning move
  for (const m of board.getEmpty()) {
    const b = board.clone();
    b.place(m.x, m.y, m.z, ai);
    if (b.winnerLine()) return m;
  }
  // 2) Block opponent's win
  for (const m of board.getEmpty()) {
    const b = board.clone();
    b.place(m.x, m.y, m.z, human);
    if (b.winnerLine()) return m;
  }
  // 3) Prefer center, then edges
  const pref = [
    {x:1,y:1,z:1},
    {x:1,y:1,z:0},{x:1,y:1,z:2},
    {x:1,y:0,z:1},{x:1,y:2,z:1},{x:0,y:1,z:1},{x:2,y:1,z:1},
  ];
  for (const m of pref) {
    if (board.state[m.z][m.y][m.x] === EMPTY) return m;
  }
  // 4) Any
  const moves = board.getEmpty();
  return moves[Math.floor(Math.random()*moves.length)];
}
