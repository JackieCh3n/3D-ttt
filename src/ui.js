export function setupUI() {
  const resultOverlay = document.getElementById('resultOverlay');
  const resultText = document.getElementById('resultText');
  const restartBtn = document.getElementById('restartBtn');

  return { resultOverlay, resultText, restartBtn };
}

export function showResult(message, color = 'white') {
  const overlay = document.getElementById('resultOverlay');
  const text = document.getElementById('resultText');
  text.textContent = message;
  text.style.color = color;
  overlay.classList.remove('hidden');
  setTimeout(() => overlay.classList.add('show'), 10);
}
