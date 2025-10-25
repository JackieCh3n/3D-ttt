window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("c");
  const statusEl = document.getElementById("status");
  const resetBtn = document.getElementById("resetBtn");
  const aiToggle = document.getElementById("aiToggle");

  let current = X;
  let locked = false;

  const game = new Game3D({
    canvas,
    onCell: handleCell,
    onStatus: (msg) => (statusEl.textContent = msg),
  });

  function handleCell(x, y, z) {
    if (locked) return;
    if (!game.drawMove(x, y, z, current)) return;
  }

  resetBtn.addEventListener("click", () => {
    game.reset();
    current = X;
    locked = false;
    statusEl.textContent = "Your turn (X)";
  });
});
