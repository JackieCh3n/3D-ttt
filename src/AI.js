export function aiMove(board) {
  // pick a random empty cell for now
  const empties = [];
  for (let i = 0; i < board.cells.length; i++) {
    if (!board.cells[i]) {
      const x = Math.floor(i / 9);
      const y = Math.floor((i % 9) / 3);
      const z = i % 3;
      empties.push({ x, y, z });
    }
  }
  return empties[Math.floor(Math.random() * empties.length)] || { x: 0, y: 0, z: 0 };
}
