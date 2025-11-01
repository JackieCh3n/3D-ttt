import * as THREE from 'three';
import { createPiece } from './pieces.js';
import { aiChooseMove } from './ai.js';
import { checkWinner, isBoardFull } from './winner.js';
import { showResult } from './ui.js';

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let boardState = Array(3).fill().map(() =>
  Array(3).fill().map(() => Array(3).fill(0))
);
let gameOver = false;
let cellMeshesRef = [];

export function initGame(scene, camera, renderer, controls, cellMeshes) {
  cellMeshesRef = cellMeshes;

  function animate() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  return { animate };
}

export function onMouseDown(event, scene, camera, renderer) {
  if (gameOver) return;

  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(cellMeshesRef);
  if (intersects.length === 0) return;

  const hit = intersects[0].object;
  const { x, y, z } = hit.userData.grid;

  if (!placePieceAt(x, y, z, 1, scene)) return;
  if (checkForWin(1)) return;

  const aiMove = aiChooseMove(boardState);
  if (aiMove) {
    placePieceAt(aiMove.x, aiMove.y, aiMove.z, 2, scene);
    checkForWin(2);
  }
}

function placePieceAt(x, y, z, playerId, scene) {
  if (boardState[z][y][x] !== 0) return false;

  const cube = cellMeshesRef.find(c => {
    const g = c.userData.grid;
    return g.x === x && g.y === y && g.z === z;
  });
  if (!cube) return false;

  createPiece(cube, playerId === 1 ? 'O' : 'X', scene);
  boardState[z][y][x] = playerId;
  return true;
}

function checkForWin(player) {
  const winner = checkWinner(boardState);
  if (winner === player) {
    showResult(player === 1 ? 'You Win!' : 'AI Wins!', player === 1 ? '#4dff4d' : '#ff4d4d');
    gameOver = true;
    return true;
  }
  if (isBoardFull(boardState) && winner === 0) {
    showResult('Draw!', '#ffffff');
    gameOver = true;
    return true;
  }
  return false;
}
export function onPlayerMove(x, y, z, scene) {
  if (gameOver) return;

  if (!placePieceAt(x, y, z, 1, scene)) return;
  if (checkForWin(1)) return;

  const aiMove = aiChooseMove(boardState);
  if (aiMove) {
    placePieceAt(aiMove.x, aiMove.y, aiMove.z, 2, scene);
    checkForWin(2);
  }
}

