import { Game3D } from './Game.js';
import { X, O } from './Board.js';
import { aiMove } from './AI.js';

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('c');
  const statusEl = document.getElementById('status');
  const resetBtn = document.getElementById('resetBtn');
  const aiToggle = document.getElementById('aiToggle');

  let current = X; // player X starts
  let locked = false;

  const game = new Game3D({
    canvas,
    THREE: window.THREE,
    OrbitControls: window.OrbitControls,
    onCell: handleCell,
    onStatus: (msg) => (statusEl.textContent = msg),
  });

  function handleCell(x, y, z) {
    if (locked) return;
    // human is X
    if (!game.drawMove(x, y, z, current)) return; // occupied
    const win = game.board.winnerLine();
    if (win) return endGame('You win!', win);
    if (game.board.isFull()) return endGame('Draw.');

    // AI turn?
    if (aiToggle.checked) {
      locked = true;
      statusEl.textContent = 'AI thinking...';
      setTimeout(() => {
        const { x: ax, y: ay, z: az } = aiMove(game.board);
        game.drawMove(ax, ay, az, O);
        const w = game.board.winnerLine();
        if (w) endGame('AI wins.', w);
        else if (game.board.isFull()) endGame('Draw.');
        else {
          statusEl.textContent = 'Your turn (X)';
          locked = false;
        }
      }, 250);
    }
  }

  function endGame(msg, winLine = null) {
    if (winLine) game.highlightWin(winLine);
    statusEl.textContent = msg + ' (click New Game)';
    locked = true;
  }

  resetBtn.addEventListener('click', () => {
    console.log("New Game clicked");
    game.reset();
    current = X;
    locked = false;
    statusEl.textContent = 'Your turn (X)';
  });
});
